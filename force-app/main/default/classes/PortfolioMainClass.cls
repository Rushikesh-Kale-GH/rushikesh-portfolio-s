public without sharing class PortfolioMainClass {

    @AuraEnabled
    public static String createUserContact(Id lwcId, String jsonString) {
        try {
            Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonString);
            User_Contact__c newContact = new User_Contact__c();
            newContact.Name = (String) data.get('name');
            newContact.Email__c = (String) data.get('email');
            newContact.Company__c = (String) data.get('company');
            newContact.Phone__c = (String) data.get('phone');
            newContact.Subject__c = (String) data.get('subject');
            newContact.Message__c = (String) data.get('message');
            newContact.Tracking_Id__c = lwcId; 
            insert newContact;
            return 'Record Created Successfully: ' + newContact.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error processing request: ' + e.getMessage());
        }
    }

     @AuraEnabled
    public static void updateVisitorTracking(Id recordId, String trackingJson) {
        if (recordId == null) {
            throw new AuraHandledException('Record Id is required.');
        }
        if (String.isBlank(trackingJson)) {
            throw new AuraHandledException('Tracking JSON cannot be empty.');
        }
        Map<String, Object> parsedData =
            (Map<String, Object>) JSON.deserializeUntyped(trackingJson);
        String engagementJson = parsedData.containsKey('engagement')
            ? JSON.serialize(parsedData.get('engagement'))
            : null;
        String clicksJson = parsedData.containsKey('clicks')
            ? JSON.serialize(parsedData.get('clicks'))
            : null;
        String navigationJson = parsedData.containsKey('nav')
            ? JSON.serialize(parsedData.get('nav'))
            : null;
        User_Visitor_Tracking__c recordToUpdate = new User_Visitor_Tracking__c(
            Id = recordId,
            Engagement__c = engagementJson,
            Clicks__c = clicksJson,
            Navigation__c = navigationJson
        );
        update recordToUpdate;
    }

    @AuraEnabled
    public static String getLiveViewCount() {
        List<User_Visitor_Tracking__c> globalLatest = [SELECT Name FROM User_Visitor_Tracking__c 
                                       ORDER BY CreatedDate DESC LIMIT 1];
                                       String autoNumber = globalLatest[0]?.Name;
        String numericPart = autoNumber?.replaceAll('[^0-9]', '');
        Integer latestCount = Integer.valueOf(numericPart);
        Integer finalCount = latestCount + 1;
        return String.valueOf(finalCount);
    }

    @AuraEnabled
    public static Map<String, Object> getOrRegisterIP() {
        List<User_Visitor_Tracking__c> globalLatest = [SELECT Name FROM User_Visitor_Tracking__c 
                                       ORDER BY CreatedDate DESC LIMIT 1];
        String autoNumber = globalLatest[0]?.Name;
        String numericPart = autoNumber?.replaceAll('[^0-9]', '');
        Integer latestCount = Integer.valueOf(numericPart);
        Map<String, Object> response = new Map<String, Object>();
        String recordId = null;
                User_Visitor_Tracking__c newLog = new User_Visitor_Tracking__c(IP_Address__c = '0.0.0.'+(latestCount+1));
                insert newLog;
                recordId = newLog.Id;
                Integer finalCount = latestCount + 1;
        response.put('recordId', recordId);
        response.put('countValue', String.valueOf(finalCount));
        return response;
    }

    @AuraEnabled(cacheable=true)
    public static Rushikesh_Information__mdt getRushikeshMdtInfo() {
        try {
            return [ SELECT name__c, full_name__c, post__c, sub_post__c, 
                github_id__c, github_url__c, email_id__c, secondary_email_id__c, trialhead_url__c, linkedin_url__c, 
                current_company_name__c, contact_number__c, about__c, about_html__c 
                FROM rushikesh_information__mdt WHERE Name__c = 'Rushikesh Kale' 
                LIMIT 1 ];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving metadata: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, String> getSvgIconsByName(String iconNames) {
        Map<String, String> iconMap = new Map<String, String>(); 
        if (String.isBlank(iconNames)) {
            return iconMap;
        }
        List<String> nameList = iconNames.split(';');
        try {
            for (SVG_Icon__c icon : [ SELECT Name, SVG_Code__c FROM SVG_Icon__c WHERE Name IN :nameList and IsActive__c = true ]) {
                iconMap.put(icon.Name, icon.SVG_Code__c);
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching SVG icons: ' + e.getMessage());
        }
        return iconMap;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, List<SVG_Icon__c>> getIconsByContext() {
        Map<String, List<SVG_Icon__c>> groupedMap = new Map<String, List<SVG_Icon__c>>();
        try {
            List<SVG_Icon__c> allIcons = [
                SELECT Name, SVG_Label__c, SVG_Functional_Context__c, Menu_Rank__c, SVG_Code__c 
                FROM SVG_Icon__c 
                WHERE SVG_Functional_Context__c != null and IsActive__c = true
                ORDER BY Menu_Rank__c
            ];
            for (SVG_Icon__c icon : allIcons) {
                List<String> contexts = icon.SVG_Functional_Context__c.split(';');
                for (String context : contexts) {
                    if (!groupedMap.containsKey(context)) {
                        groupedMap.put(context, new List<SVG_Icon__c>());
                    }
                    groupedMap.get(context).add(icon);
                }
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error processing SVG data: ' + e.getMessage());
        }
        return groupedMap;
    }

    public class AchievementWrapper {
        @AuraEnabled public String name {get;set;}
        @AuraEnabled public String logoBase64 {get;set;}
        @AuraEnabled public String certBase64 {get;set;}
        @AuraEnabled public String description {get;set;}
        @AuraEnabled public Date sdate {get;set;}

        public AchievementWrapper(String name) {
            this.name = name;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<AchievementWrapper> getCertificateDetails() {
        List<Professional_Achievement__c> records = [
            SELECT Id, Achievement_Name__c, RecordType.Name , Description__c, Start_Date__c, Hashtags__c, Techstack__c
            FROM Professional_Achievement__c
            WHERE IsActive__c = true
            AND (RecordType.Name = 'Professional Certification')
            ORDER BY Start_Date__c DESC
        ];
        if(records.isEmpty()) {
            return new List<AchievementWrapper>();
        }
        List<AchievementWrapper> wrapperList = new List<AchievementWrapper>();
        for(Professional_Achievement__c pa : records) {
            AchievementWrapper wrap = new AchievementWrapper(pa.Achievement_Name__c);
            wrap.description = pa.Description__c;
            wrap.sdate = pa.Start_Date__c;
            wrap.certBase64 = pa.Hashtags__c;
            wrap.logoBase64 = pa.Techstack__c;
            wrapperList.add(wrap);
        }
        return wrapperList;
    }

    public class EducationWrapper {
        @AuraEnabled public String degree {get;set;}
        @AuraEnabled public String institution {get;set;}
        @AuraEnabled public String duration {get;set;}
        @AuraEnabled public String grade {get;set;}
        @AuraEnabled public String description {get;set;}
        @AuraEnabled public String imageUrl {get;set;}
        @AuraEnabled public String location {get;set;}
        @AuraEnabled public String siteUrl {get;set;}
        @AuraEnabled public Boolean isPrimary {get;set;}
    }

    @AuraEnabled(cacheable=true)
    public static List<EducationWrapper> getEducationDetails() {
        List<Professional_Achievement__c> records = [
            SELECT Id, Achievement_Name__c, RecordType.Name, Description__c, Techstack__c, Issued_By__c, Hashtags__c, Available_URL__c, Extra_Data__c
            FROM Professional_Achievement__c
            WHERE IsActive__c = true
            AND RecordType.Name = 'Academic Education'
            ORDER BY Start_Date__c DESC
        ];
        if(records.isEmpty()) {
            return new List<EducationWrapper>();
        }
        List<EducationWrapper> wrapperList = new List<EducationWrapper>();
        for(Professional_Achievement__c pa : records) {
            EducationWrapper wrap = new EducationWrapper();
            wrap.degree = pa.Achievement_Name__c;
            wrap.institution = pa.Issued_By__c;
            wrap.duration = pa.Techstack__c;
            wrap.grade = pa.Hashtags__c;
            wrap.description = pa.Description__c;
            wrap.location = 'Pune, Maharashtra, India';
            wrap.siteUrl = pa.Available_URL__c;
            wrap.isPrimary = true;
            wrap.imageUrl = pa.Extra_Data__c;
            wrapperList.add(wrap);
        }
        return wrapperList;
    }

    @AuraEnabled(cacheable=true)
    public static List<EducationWrapper> getRewardAndRecognation() {
        List<Professional_Achievement__c> records = [
            SELECT Id, Achievement_Name__c, RecordType.Name, Description__c, Techstack__c, Issued_By__c, Hashtags__c, Available_URL__c, Extra_Data__c
            FROM Professional_Achievement__c
            WHERE IsActive__c = true
            AND RecordType.Name = 'Honors Award'
            ORDER BY Start_Date__c DESC
        ];
        if(records.isEmpty()) {
            return new List<EducationWrapper>();
        }
        List<EducationWrapper> wrapperList = new List<EducationWrapper>();
        for(Professional_Achievement__c pa : records) {
            EducationWrapper wrap = new EducationWrapper();
            wrap.degree = pa.Achievement_Name__c;
            wrap.institution = pa.Issued_By__c;
            wrap.duration = pa.Techstack__c;
            wrap.grade = pa.Hashtags__c;
            wrap.description = pa.Description__c;
            wrap.location = 'Pune, Maharashtra, India';
            wrap.siteUrl = pa.Available_URL__c;
            wrap.isPrimary = true;
            wrap.imageUrl = pa.Extra_Data__c;
            wrapperList.add(wrap);
        }
        return wrapperList;
    }
}