/* Run once in the RAK Airport SQL Server database before deploying the API. */
SET XACT_ABORT ON;
BEGIN TRANSACTION;

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
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusStops PRIMARY KEY DEFAULT NEWID(), Name nvarchar(120) NOT NULL, LocationDetails nvarchar(500) NULL, IsActive bit NOT NULL CONSTRAINT DF_BusStops_Active DEFAULT 1,
  CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusStops_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusStops_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL, CONSTRAINT UQ_BusStops_Name UNIQUE(Name));
IF OBJECT_ID('dbo.BusTripStops','U') IS NULL CREATE TABLE dbo.BusTripStops (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusTripStops PRIMARY KEY DEFAULT NEWID(), TripId uniqueidentifier NOT NULL CONSTRAINT FK_BusTripStops_Trip REFERENCES dbo.BusTrips(Id) ON DELETE CASCADE, StopId uniqueidentifier NOT NULL CONSTRAINT FK_BusTripStops_Stop REFERENCES dbo.BusStops(Id),
  StopOrder int NOT NULL CONSTRAINT CK_BusTripStops_Order CHECK(StopOrder > 0), ArrivalTime time(0) NOT NULL, WaitingMinutes smallint NOT NULL CONSTRAINT CK_BusTripStops_Wait CHECK(WaitingMinutes >= 0 AND WaitingMinutes <= 240), DepartureTime time(0) NOT NULL,
  CONSTRAINT UQ_BusTripStops_Order UNIQUE(TripId,StopOrder), CONSTRAINT UQ_BusTripStops_Stop UNIQUE(TripId,StopId));
IF OBJECT_ID('dbo.BusAnnouncements','U') IS NULL CREATE TABLE dbo.BusAnnouncements (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusAnnouncements PRIMARY KEY DEFAULT NEWID(), Title nvarchar(160) NOT NULL, Message nvarchar(1000) NOT NULL, Type nvarchar(24) NOT NULL CONSTRAINT CK_BusAnnouncements_Type CHECK(Type IN ('Information','Warning','Service Suspension')),
  IsActive bit NOT NULL CONSTRAINT DF_BusAnnouncements_Active DEFAULT 0, StartDate date NULL, EndDate date NULL, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusAnnouncements_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusAnnouncements_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL, CONSTRAINT CK_BusAnnouncements_Dates CHECK(EndDate IS NULL OR StartDate IS NULL OR EndDate >= StartDate));
IF OBJECT_ID('dbo.BusServiceSettings','U') IS NULL CREATE TABLE dbo.BusServiceSettings (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusServiceSettings PRIMARY KEY DEFAULT NEWID(), ServiceEnabled bit NOT NULL CONSTRAINT DF_BusSettings_Enabled DEFAULT 1, ContactNumber nvarchar(50) NOT NULL CONSTRAINT DF_BusSettings_Contact DEFAULT '800 1700', EligibilityMessage nvarchar(1000) NULL, ReturnJourneyMessage nvarchar(1000) NULL, UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusSettings_Updated DEFAULT SYSUTCDATETIME(), UpdatedBy nvarchar(128) NULL);
IF OBJECT_ID('dbo.BusAuditLogs','U') IS NULL CREATE TABLE dbo.BusAuditLogs (Id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_BusAuditLogs PRIMARY KEY, Administrator nvarchar(128) NOT NULL, Action nvarchar(30) NOT NULL, EntityType nvarchar(40) NOT NULL, EntityId uniqueidentifier NULL, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusAuditLogs_Created DEFAULT SYSUTCDATETIME());
IF OBJECT_ID('dbo.BusAdminUsers','U') IS NULL CREATE TABLE dbo.BusAdminUsers (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_BusAdminUsers PRIMARY KEY DEFAULT NEWID(), Username nvarchar(128) NOT NULL CONSTRAINT UQ_BusAdminUsers_Username UNIQUE,
  PasswordHash nvarchar(512) NOT NULL, IsActive bit NOT NULL CONSTRAINT DF_BusAdminUsers_Active DEFAULT 1, CreatedAt datetime2 NOT NULL CONSTRAINT DF_BusAdminUsers_Created DEFAULT SYSUTCDATETIME(), UpdatedAt datetime2 NOT NULL CONSTRAINT DF_BusAdminUsers_Updated DEFAULT SYSUTCDATETIME(), CreatedBy nvarchar(128) NULL, UpdatedBy nvarchar(128) NULL);
IF COL_LENGTH('dbo.BusAdminUsers','FullName') IS NULL ALTER TABLE dbo.BusAdminUsers ADD FullName nvarchar(160) NULL;
IF COL_LENGTH('dbo.BusAdminUsers','Email') IS NULL ALTER TABLE dbo.BusAdminUsers ADD Email nvarchar(254) NULL;
IF COL_LENGTH('dbo.BusAdminUsers','Role') IS NULL ALTER TABLE dbo.BusAdminUsers ADD Role nvarchar(30) NOT NULL CONSTRAINT DF_BusAdminUsers_Role DEFAULT 'Schedule Manager';
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BusTrips_Route_Public') CREATE INDEX IX_BusTrips_Route_Public ON dbo.BusTrips(RouteId,IsActive,IsPublished,SortOrder);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BusAnnouncements_Active_Dates') CREATE INDEX IX_BusAnnouncements_Active_Dates ON dbo.BusAnnouncements(IsActive,StartDate,EndDate);
IF NOT EXISTS (SELECT 1 FROM dbo.BusServiceSettings) INSERT INTO dbo.BusServiceSettings(ServiceEnabled,ContactNumber,EligibilityMessage,ReturnJourneyMessage) VALUES(1,'800 1700','Available for passengers holding valid flight tickets to or from Ras Al Khaimah International Airport.','Return shuttle service operates according to flight arrivals. Please contact the airport for assistance.');
COMMIT TRANSACTION;
