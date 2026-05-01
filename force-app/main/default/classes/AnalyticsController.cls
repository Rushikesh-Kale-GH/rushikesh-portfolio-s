public with sharing class AnalyticsController {

    // ─────────────────────────────────────────────
    // Last 7 days of scores for current user
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static List<DayStatWrapper> getWeeklyStats() {
        String userId = UserInfo.getUserId();
        Date weekAgo  = Date.today().addDays(-6);

        List<Day_Log__c> logs = [
            SELECT Id, Date__c, Score__c, Health_Score__c,
                   Career_Score__c, Discipline_Score__c,
                   Completed_Tasks__c, Total_Tasks__c
            FROM Day_Log__c
            WHERE Date__c >= :weekAgo
              AND OwnerId  = :userId
            ORDER BY Date__c ASC
        ];

        List<DayStatWrapper> stats = new List<DayStatWrapper>();
        for (Day_Log__c log : logs) {
            DayStatWrapper w = new DayStatWrapper();
            w.logDate        = String.valueOf(log.Date__c);
            w.score          = log.Score__c != null ? log.Score__c : 0;
            w.healthScore    = log.Health_Score__c   != null ? log.Health_Score__c   : 0;
            w.careerScore    = log.Career_Score__c   != null ? log.Career_Score__c   : 0;
            w.disciplineScore= log.Discipline_Score__c != null ? log.Discipline_Score__c : 0;
            w.completedTasks = log.Completed_Tasks__c != null ? log.Completed_Tasks__c.intValue() : 0;
            w.totalTasks     = log.Total_Tasks__c    != null ? log.Total_Tasks__c.intValue()    : 0;
            stats.add(w);
        }
        return stats;
    }

    // ─────────────────────────────────────────────
    // Category distribution (last 30 days)
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static List<CategoryStatWrapper> getCategoryDistribution() {
        String userId  = UserInfo.getUserId();
        Date monthAgo  = Date.today().addDays(-29);

        List<Task_Log__c> logs = [
            SELECT Task__r.Category__c, Status__c
            FROM Task_Log__c
            WHERE Day_Log__r.Date__c >= :monthAgo
              AND OwnerId = :userId
        ];

        Map<String, Integer> totalMap     = new Map<String, Integer>();
        Map<String, Integer> completedMap = new Map<String, Integer>();

        for (Task_Log__c tl : logs) {
            String cat = tl.Task__r.Category__c;
            if (cat == null) continue;
            totalMap.put(cat,     (totalMap.containsKey(cat)     ? totalMap.get(cat)     : 0) + 1);
            if (tl.Status__c)
                completedMap.put(cat, (completedMap.containsKey(cat) ? completedMap.get(cat) : 0) + 1);
        }

        List<CategoryStatWrapper> stats = new List<CategoryStatWrapper>();
        for (String cat : totalMap.keySet()) {
            CategoryStatWrapper w = new CategoryStatWrapper();
            w.category   = cat;
            w.total      = totalMap.get(cat);
            w.completed  = completedMap.containsKey(cat) ? completedMap.get(cat) : 0;
            w.percentage = w.total > 0
                ? ((Decimal.valueOf(w.completed) / w.total) * 100).setScale(1)
                : 0;
            stats.add(w);
        }
        return stats;
    }

    // ─────────────────────────────────────────────
    // Streak: consecutive days with Score >= 80%
    // ─────────────────────────────────────────────
    @AuraEnabled(cacheable=false)
    public static Integer getStreak() {
        String userId = UserInfo.getUserId();
        List<Day_Log__c> logs = [
            SELECT Date__c, Score__c
            FROM Day_Log__c
            WHERE OwnerId = :userId
            ORDER BY Date__c DESC
            LIMIT 90
        ];

        Integer streak  = 0;
        Date   expected = Date.today();

        for (Day_Log__c log : logs) {
            if (log.Date__c != expected) break;
            if (log.Score__c == null || log.Score__c < 80) break;
            streak++;
            expected = expected.addDays(-1);
        }
        return streak;
    }

    // ─── Inner Wrappers ─────────────────────────
    public class DayStatWrapper {
        @AuraEnabled public String  logDate          { get; set; }
        @AuraEnabled public Decimal score            { get; set; }
        @AuraEnabled public Decimal healthScore      { get; set; }
        @AuraEnabled public Decimal careerScore      { get; set; }
        @AuraEnabled public Decimal disciplineScore  { get; set; }
        @AuraEnabled public Integer completedTasks   { get; set; }
        @AuraEnabled public Integer totalTasks       { get; set; }
    }

    public class CategoryStatWrapper {
        @AuraEnabled public String  category   { get; set; }
        @AuraEnabled public Integer total      { get; set; }
        @AuraEnabled public Integer completed  { get; set; }
        @AuraEnabled public Decimal percentage { get; set; }
    }
}
