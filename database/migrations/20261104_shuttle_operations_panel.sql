/* RAK Airport Shuttle Operations Panel — additive SQL Server migration.
   Run in the RAKAirport database through SSMS. No existing data is deleted. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* Self-contained base schema. These blocks run only for a new installation;
   existing shuttle data and tables are left untouched. */
IF OBJECT_ID('dbo.BusRoutes','U') IS NULL CREATE TABLE dbo.BusRoutes (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusRoutes PRIMARY KEY DEFAULT NEWID(), Name nvarchar(120) NOT NULL,
  Description nvarchar(1000) NULL, Direction nvarchar(20) NOT NULL CONSTRAINT CK_BusRoutes_Direction CHECK (Direction IN ('To Airport','From Airport')),
  IsActive bit NOT NULL CONSTRAINT DF_BusRoutes_Active DEFAULT 1, PublicationStatus nvarchar(12) NOT NULL CONSTRAINT DF_BusRoutes_Publication DEFAULT 'Draft' CONSTRAINT CK_BusRoutes_Publication CHECK (PublicationStatus IN ('Draft','Published')),
  SortOrder int NOT NULL CONSTRAINT DF_BusRoutes_Sort DEFAULT 0, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusRoutes_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusRoutes_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL);
IF OBJECT_ID('dbo.BusTrips','U') IS NULL CREATE TABLE dbo.BusTrips (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusTrips PRIMARY KEY DEFAULT NEWID(), RouteId uniqueidentifier NOT NULL CONSTRAINT FK_BusTrips_Route REFERENCES dbo.BusRoutes(Id) ON DELETE CASCADE,
  TripName nvarchar(120) NOT NULL, OperatingDays nvarchar(200) NOT NULL, AirportArrivalTime time(0) NOT NULL, IsActive bit NOT NULL CONSTRAINT DF_BusTrips_Active DEFAULT 1, IsPublished bit NOT NULL CONSTRAINT DF_BusTrips_Published DEFAULT 0,
  SortOrder int NOT NULL CONSTRAINT DF_BusTrips_Sort DEFAULT 0, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusTrips_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusTrips_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL);
IF OBJECT_ID('dbo.BusStops','U') IS NULL CREATE TABLE dbo.BusStops (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusStops PRIMARY KEY DEFAULT NEWID(), Name nvarchar(120) NOT NULL,
  LocationDetails nvarchar(500) NULL, IsActive bit NOT NULL CONSTRAINT DF_BusStops_Active DEFAULT 1,
  CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusStops_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusStops_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL, CONSTRAINT UQ_BusStops_Name UNIQUE(Name));
IF OBJECT_ID('dbo.BusTripStops','U') IS NULL CREATE TABLE dbo.BusTripStops (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusTripStops PRIMARY KEY DEFAULT NEWID(), TripId uniqueidentifier NOT NULL CONSTRAINT FK_BusTripStops_Trip REFERENCES dbo.BusTrips(Id) ON DELETE CASCADE, StopId uniqueidentifier NOT NULL CONSTRAINT FK_BusTripStops_Stop REFERENCES dbo.BusStops(Id),
  StopOrder int NOT NULL CONSTRAINT CK_BusTripStops_Order CHECK (StopOrder > 0), ArrivalTime time(0) NOT NULL, WaitingMinutes smallint NOT NULL CONSTRAINT CK_BusTripStops_Wait CHECK (WaitingMinutes BETWEEN 0 AND 240), DepartureTime time(0) NOT NULL,
  CONSTRAINT UQ_BusTripStops_Order UNIQUE(TripId,StopOrder), CONSTRAINT UQ_BusTripStops_Stop UNIQUE(TripId,StopId));
IF OBJECT_ID('dbo.BusAnnouncements','U') IS NULL CREATE TABLE dbo.BusAnnouncements (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusAnnouncements PRIMARY KEY DEFAULT NEWID(), Title nvarchar(160) NOT NULL, Message nvarchar(1000) NOT NULL,
  Type nvarchar(24) NOT NULL CONSTRAINT CK_BusAnnouncements_Type CHECK (Type IN ('Information','Warning','Service Suspension')), IsActive bit NOT NULL CONSTRAINT DF_BusAnnouncements_Active DEFAULT 0,
  StartDate date NULL, EndDate date NULL, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusAnnouncements_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusAnnouncements_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL,
  CONSTRAINT CK_BusAnnouncements_Dates CHECK(EndDate IS NULL OR StartDate IS NULL OR EndDate >= StartDate));
IF OBJECT_ID('dbo.BusServiceSettings','U') IS NULL CREATE TABLE dbo.BusServiceSettings (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusServiceSettings PRIMARY KEY DEFAULT NEWID(), ServiceEnabled bit NOT NULL CONSTRAINT DF_BusSettings_Enabled DEFAULT 1,
  ContactNumber nvarchar(50) NOT NULL CONSTRAINT DF_BusSettings_Contact DEFAULT '800 1700', EligibilityMessage nvarchar(1000) NULL, ReturnJourneyMessage nvarchar(1000) NULL,
  UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusSettings_Updated DEFAULT SYSUTCDATETIME(), UpdatedBy nvarchar(128) NULL);
IF OBJECT_ID('dbo.BusAuditLogs','U') IS NULL CREATE TABLE dbo.BusAuditLogs (
  Id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_BusAuditLogs PRIMARY KEY, Administrator nvarchar(128) NOT NULL, Action nvarchar(30) NOT NULL,
  EntityType nvarchar(40) NOT NULL, EntityId uniqueidentifier NULL, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusAuditLogs_Created DEFAULT SYSUTCDATETIME());
IF NOT EXISTS (SELECT 1 FROM dbo.BusServiceSettings) INSERT INTO dbo.BusServiceSettings(ServiceEnabled,ContactNumber,EligibilityMessage,ReturnJourneyMessage)
  VALUES(1,N'800 1700',N'Available for passengers holding valid flight tickets to or from Ras Al Khaimah International Airport.',N'Return shuttle service operates according to flight arrivals. Please contact the airport for assistance.');

/* Extend existing shuttle records for an operations workflow. */
IF COL_LENGTH('dbo.BusRoutes','ScheduleName') IS NULL ALTER TABLE dbo.BusRoutes ADD ScheduleName nvarchar(160) NULL;
IF COL_LENGTH('dbo.BusRoutes','RouteNumber') IS NULL ALTER TABLE dbo.BusRoutes ADD RouteNumber nvarchar(40) NULL;
IF COL_LENGTH('dbo.BusRoutes','StartingLocation') IS NULL ALTER TABLE dbo.BusRoutes ADD StartingLocation nvarchar(160) NULL;
IF COL_LENGTH('dbo.BusRoutes','FinalDestination') IS NULL ALTER TABLE dbo.BusRoutes ADD FinalDestination nvarchar(160) NULL;
IF COL_LENGTH('dbo.BusRoutes','OperatingDays') IS NULL ALTER TABLE dbo.BusRoutes ADD OperatingDays nvarchar(200) NULL;
IF COL_LENGTH('dbo.BusRoutes','ReturnJourneyEnabled') IS NULL ALTER TABLE dbo.BusRoutes ADD ReturnJourneyEnabled bit NOT NULL CONSTRAINT DF_BusRoutes_ReturnEnabled DEFAULT 0;
IF COL_LENGTH('dbo.BusRoutes','ReturnJourneyNotes') IS NULL ALTER TABLE dbo.BusRoutes ADD ReturnJourneyNotes nvarchar(1000) NULL;
IF COL_LENGTH('dbo.BusTrips','PublicationStatus') IS NULL ALTER TABLE dbo.BusTrips ADD PublicationStatus nvarchar(12) NOT NULL CONSTRAINT DF_BusTrips_Publication DEFAULT 'Draft';
IF COL_LENGTH('dbo.BusTrips','EffectiveFrom') IS NULL ALTER TABLE dbo.BusTrips ADD EffectiveFrom date NULL;
IF COL_LENGTH('dbo.BusTrips','EffectiveTo') IS NULL ALTER TABLE dbo.BusTrips ADD EffectiveTo date NULL;
IF COL_LENGTH('dbo.BusTrips','TripNumber') IS NULL ALTER TABLE dbo.BusTrips ADD TripNumber nvarchar(40) NULL;
IF COL_LENGTH('dbo.BusTrips','Remarks') IS NULL ALTER TABLE dbo.BusTrips ADD Remarks nvarchar(1000) NULL;

IF OBJECT_ID('dbo.BusServiceStatus','U') IS NULL CREATE TABLE dbo.BusServiceStatus (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusServiceStatus PRIMARY KEY DEFAULT NEWID(),
  Status nvarchar(20) NOT NULL CONSTRAINT CK_BusServiceStatus_Status CHECK (Status IN ('Operational','Delayed','Suspended','Maintenance')),
  PublicMessage nvarchar(1000) NULL, StartsAt datetime2 NULL, ExpectedRestorationAt datetime2 NULL,
  IsCurrent bit NOT NULL CONSTRAINT DF_BusServiceStatus_Current DEFAULT 1,
  CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusServiceStatus_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusServiceStatus_Updated DEFAULT SYSUTCDATETIME(),
  CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL);

IF OBJECT_ID('dbo.BusReturnStops','U') IS NULL CREATE TABLE dbo.BusReturnStops (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusReturnStops PRIMARY KEY DEFAULT NEWID(), RouteId uniqueidentifier NOT NULL CONSTRAINT FK_BusReturnStops_Route REFERENCES dbo.BusRoutes(Id) ON DELETE CASCADE,
  StopName nvarchar(120) NOT NULL, LocationDetails nvarchar(500) NULL, StopOrder int NOT NULL CONSTRAINT CK_BusReturnStops_Order CHECK(StopOrder>0),
  CONSTRAINT UQ_BusReturnStops_Order UNIQUE(RouteId,StopOrder));

/* Explicit permissions are data-driven. The application still enforces these
   roles server-side; this table documents and audits the intended scope. */
IF OBJECT_ID('dbo.BusRolePermissions','U') IS NULL CREATE TABLE dbo.BusRolePermissions (
  RoleName nvarchar(30) NOT NULL, PermissionCode nvarchar(80) NOT NULL,
  CONSTRAINT PK_BusRolePermissions PRIMARY KEY(RoleName,PermissionCode),
  CONSTRAINT CK_BusRolePermissions_Role CHECK(RoleName IN ('Super Admin','Editor')));
MERGE dbo.BusRolePermissions AS target
USING (VALUES
  ('Super Admin','team.manage'),('Super Admin','service.status.manage'),('Super Admin','schedule.publish'),('Super Admin','schedule.manage'),('Super Admin','alerts.manage'),
  ('Editor','schedule.manage'),('Editor','alerts.manage')) AS source(RoleName,PermissionCode)
ON target.RoleName=source.RoleName AND target.PermissionCode=source.PermissionCode
WHEN NOT MATCHED THEN INSERT(RoleName,PermissionCode) VALUES(source.RoleName,source.PermissionCode);

IF OBJECT_ID('dbo.BusAdminUsers','U') IS NULL CREATE TABLE dbo.BusAdminUsers (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusAdminUsers PRIMARY KEY DEFAULT NEWID(), Username nvarchar(128) NOT NULL CONSTRAINT UQ_BusAdminUsers_Username UNIQUE,
  FullName nvarchar(160) NULL, Email nvarchar(254) NULL, PasswordHash nvarchar(512) NOT NULL,
  Role nvarchar(30) NOT NULL CONSTRAINT DF_BusAdminUsers_Role DEFAULT 'Editor' CONSTRAINT CK_BusAdminUsers_Role CHECK(Role IN ('Super Admin','Editor')),
  IsActive bit NOT NULL CONSTRAINT DF_BusAdminUsers_Active DEFAULT 1, DeletedAt datetime2 NULL,
  CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusAdminUsers_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusAdminUsers_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL);
IF COL_LENGTH('dbo.BusAdminUsers','FullName') IS NULL ALTER TABLE dbo.BusAdminUsers ADD FullName nvarchar(160) NULL;
IF COL_LENGTH('dbo.BusAdminUsers','Email') IS NULL ALTER TABLE dbo.BusAdminUsers ADD Email nvarchar(254) NULL;
IF COL_LENGTH('dbo.BusAdminUsers','Role') IS NULL ALTER TABLE dbo.BusAdminUsers ADD Role nvarchar(30) NOT NULL CONSTRAINT DF_BusAdminUsers_Role_Upgrade DEFAULT 'Editor';
IF COL_LENGTH('dbo.BusAdminUsers','DeletedAt') IS NULL ALTER TABLE dbo.BusAdminUsers ADD DeletedAt datetime2 NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_BusAdminUsers_Email' AND object_id=OBJECT_ID('dbo.BusAdminUsers')) EXEC(N'CREATE UNIQUE INDEX UX_BusAdminUsers_Email ON dbo.BusAdminUsers(Email) WHERE Email IS NOT NULL AND DeletedAt IS NULL');
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BusServiceStatus_Current' AND object_id=OBJECT_ID('dbo.BusServiceStatus')) EXEC(N'CREATE INDEX IX_BusServiceStatus_Current ON dbo.BusServiceStatus(IsCurrent,UpdatedAt DESC)');
IF COL_LENGTH('dbo.BusAuditLogs','ChangeSummary') IS NULL ALTER TABLE dbo.BusAuditLogs ADD ChangeSummary nvarchar(2000) NULL;
IF COL_LENGTH('dbo.BusAuditLogs','SourceIp') IS NULL ALTER TABLE dbo.BusAuditLogs ADD SourceIp nvarchar(64) NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BusAuditLogs_Entity_CreatedAt' AND object_id=OBJECT_ID('dbo.BusAuditLogs')) EXEC(N'CREATE INDEX IX_BusAuditLogs_Entity_CreatedAt ON dbo.BusAuditLogs(EntityType,EntityId,CreatedAt DESC)');
IF NOT EXISTS (SELECT 1 FROM dbo.BusServiceStatus) INSERT INTO dbo.BusServiceStatus(Status,PublicMessage,IsCurrent,CreatedBy) VALUES('Operational',N'Shuttle service is operating. Please check the timetable before travelling.',1,N'Migration');
COMMIT TRANSACTION;
