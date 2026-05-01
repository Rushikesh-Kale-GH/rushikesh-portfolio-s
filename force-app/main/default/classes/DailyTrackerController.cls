public with sharing class DailyTrackerController {

    // ─────────────────────────────────────────────
    // Get or Create today's Day Log for current user
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static Day_Log__c getOrCreateTodayLog() {
        Date today = Date.today();
        String userId = UserInfo.getUserId();

        List<Day_Log__c> logs = [
            SELECT Id, Date__c, Total_Tasks__c, Completed_Tasks__c,
                   Score__c, Health_Score__c, Career_Score__c,
                   Discipline_Score__c, Reflection__c
            FROM Day_Log__c
            WHERE Date__c = :today
              AND OwnerId = :userId
            LIMIT 1
        ];

        if (!logs.isEmpty()) {
            return logs[0];
        }

        Day_Log__c newLog = new Day_Log__c(
            Date__c              = today,
            Total_Tasks__c       = 0,
            Completed_Tasks__c   = 0,
            Score__c             = 0,
            Health_Score__c      = 0,
            Career_Score__c      = 0,
            Discipline_Score__c  = 0
        );
        insert newLog;
        return newLog;
    }

    // ─────────────────────────────────────────────
    // Get all active tasks + today's completion status
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static List<TaskWrapper> getTodayTasks(String dayLogId) {
        String userId = UserInfo.getUserId();

        List<Task__c> allTasks = [
            SELECT Id, Name, Category__c, Type__c, Is_Active__c
            FROM Task__c
            WHERE Is_Active__c = true
            ORDER BY Category__c, Name
        ];

        Map<String, Task_Log__c> taskLogMap = new Map<String, Task_Log__c>();
        List<Task_Log__c> existingLogs = [
            SELECT Id, Task__c, Status__c, Score_Value__c
            FROM Task_Log__c
            WHERE Day_Log__c = :dayLogId
              AND OwnerId = :userId
        ];
        for (Task_Log__c tl : existingLogs) {
            taskLogMap.put(tl.Task__c, tl);
        }

        List<TaskWrapper> wrappers = new List<TaskWrapper>();
        for (Task__c t : allTasks) {
            TaskWrapper tw    = new TaskWrapper();
            tw.taskId         = t.Id;
            tw.taskName       = t.Name;
            tw.category       = t.Category__c;
            tw.taskType       = t.Type__c;
            tw.status         = taskLogMap.containsKey(t.Id)
                                    ? taskLogMap.get(t.Id).Status__c
                                    : false;
            tw.taskLogId      = taskLogMap.containsKey(t.Id)
                                    ? taskLogMap.get(t.Id).Id
                                    : null;
            wrappers.add(tw);
        }
        return wrappers;
    }

    // ─────────────────────────────────────────────
    // Save task status and recalculate score
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static void saveTaskStatus(String dayLogId, String taskId, Boolean status) {
        String userId = UserInfo.getUserId();

        List<Task_Log__c> existing = [
            SELECT Id, Status__c
            FROM Task_Log__c
            WHERE Day_Log__c = :dayLogId
              AND Task__c    = :taskId
              AND OwnerId    = :userId
            LIMIT 1
        ];

        Task_Log__c tl;
        if (!existing.isEmpty()) {
            tl            = existing[0];
            tl.Status__c  = status;
        } else {
            tl             = new Task_Log__c(
                Day_Log__c    = dayLogId,
                Task__c       = taskId,
                Status__c     = status,
                Score_Value__c = 1
            );
        }
        upsert tl;
        calculateScore(dayLogId);
    }

    // ─────────────────────────────────────────────
    // Save reflection text
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static void saveReflection(String dayLogId, String reflectionText) {
        Day_Log__c log = new Day_Log__c(
            Id            = dayLogId,
            Reflection__c = reflectionText
        );
        update log;
    }

    // ─────────────────────────────────────────────
    // Calculate and update Day Log scores
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static Day_Log__c calculateScore(String dayLogId) {
        String userId = UserInfo.getUserId();

        List<Task_Log__c> logs = [
            SELECT Id, Status__c, Score_Value__c,
                   Task__r.Category__c
            FROM Task_Log__c
            WHERE Day_Log__c = :dayLogId
              AND OwnerId    = :userId
        ];

        Integer total      = logs.size();
        Integer completed  = 0;
        Integer healthC    = 0; Integer healthT    = 0;
        Integer careerC    = 0; Integer careerT    = 0;
        Integer disciplineC= 0; Integer disciplineT= 0;

        for (Task_Log__c tl : logs) {
            String cat = tl.Task__r.Category__c;
            if (tl.Status__c) completed++;

            if (cat == 'Health')     { healthT++;     if (tl.Status__c) healthC++;      }
            else if (cat == 'Career'){ careerT++;     if (tl.Status__c) careerC++;      }
            else if (cat == 'Discipline'){ disciplineT++; if(tl.Status__c) disciplineC++; }
        }

        Decimal score      = total > 0 ? (Decimal.valueOf(completed) / total) * 100 : 0;
        Decimal healthSc   = healthT    > 0 ? (Decimal.valueOf(healthC)    / healthT)    * 100 : 0;
        Decimal careerSc   = careerT    > 0 ? (Decimal.valueOf(careerC)    / careerT)    * 100 : 0;
        Decimal disciplineSc = disciplineT > 0 ? (Decimal.valueOf(disciplineC) / disciplineT) * 100 : 0;

        Day_Log__c log       = new Day_Log__c(
            Id                   = dayLogId,
            Total_Tasks__c       = total,
            Completed_Tasks__c   = completed,
            Score__c             = score.setScale(1),
            Health_Score__c      = healthSc.setScale(1),
            Career_Score__c      = careerSc.setScale(1),
            Discipline_Score__c  = disciplineSc.setScale(1)
        );
        update log;
        return [
            SELECT Id, Total_Tasks__c, Completed_Tasks__c, Score__c,
                   Health_Score__c, Career_Score__c, Discipline_Score__c, Reflection__c
            FROM Day_Log__c WHERE Id = :dayLogId LIMIT 1
        ];
    }

    // ─── Inner Wrapper ───────────────────────────
    public class TaskWrapper {
        @AuraEnabled public String  taskId    { get; set; }
        @AuraEnabled public String  taskLogId { get; set; }
        @AuraEnabled public String  taskName  { get; set; }
        @AuraEnabled public String  category  { get; set; }
        @AuraEnabled public String  taskType  { get; set; }
        @AuraEnabled public Boolean status    { get; set; }
    }
}
