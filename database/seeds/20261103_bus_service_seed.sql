/*
  Seed timetable transcribed from the daily timetable page of
  "Ras Al Khaimah Airport Free Shuttle Bus Schedule.pdf".
  Review against the signed operational schedule before publishing changes.
  Run after 20261103_bus_service.sql. This script is idempotent: it only
  inserts records if no bus routes have been configured yet.
*/
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF NOT EXISTS (SELECT 1 FROM dbo.BusRoutes)
BEGIN
  DECLARE @r1 uniqueidentifier=NEWID(), @r2 uniqueidentifier=NEWID();
  DECLARE @r1a uniqueidentifier=NEWID(), @r1b uniqueidentifier=NEWID(), @r2a uniqueidentifier=NEWID(), @r2b uniqueidentifier=NEWID();
  DECLARE @alQuoz uniqueidentifier=NEWID(), @deira uniqueidentifier=NEWID(), @uaq uniqueidentifier=NEWID(), @muhaisna uniqueidentifier=NEWID(), @sharjah uniqueidentifier=NEWID(), @ajman uniqueidentifier=NEWID();

  INSERT INTO dbo.BusRoutes(Id,Name,Description,Direction,IsActive,PublicationStatus,SortOrder,CreatedBy,UpdatedBy) VALUES
    (@r1,N'Route 1',N'Dubai Al Quoz → Dubai Deira → Umm Al Quwain → RAK Airport',N'To Airport',1,N'Published',1,N'Schedule seed',N'Schedule seed'),
    (@r2,N'Route 2',N'Dubai Muhaisna 2 → Sharjah → Ajman → RAK Airport',N'To Airport',1,N'Published',2,N'Schedule seed',N'Schedule seed');
  INSERT INTO dbo.BusStops(Id,Name,LocationDetails,IsActive,CreatedBy,UpdatedBy) VALUES
    (@alQuoz,'Dubai Al Quoz','Dubai Al Quoz pickup point',1,'Schedule seed','Schedule seed'),
    (@deira,'Dubai Deira','Dubai Deira pickup point',1,'Schedule seed','Schedule seed'),
    (@uaq,'Umm Al Quwain','Umm Al Quwain pickup point',1,'Schedule seed','Schedule seed'),
    (@muhaisna,'Dubai Muhaisna 2','Dubai Muhaisna 2 pickup point',1,'Schedule seed','Schedule seed'),
    (@sharjah,'Sharjah','Sharjah pickup point',1,'Schedule seed','Schedule seed'),
    (@ajman,'Ajman','Ajman pickup point',1,'Schedule seed','Schedule seed');
  INSERT INTO dbo.BusTrips(Id,RouteId,TripName,OperatingDays,AirportArrivalTime,IsActive,IsPublished,SortOrder,CreatedBy,UpdatedBy) VALUES
    (@r1a,@r1,'First Trip','["Daily"]','20:00',1,1,1,'Schedule seed','Schedule seed'),
    (@r1b,@r1,'Second Trip','["Daily"]','22:45',1,1,2,'Schedule seed','Schedule seed'),
    (@r2a,@r2,'First Trip','["Daily"]','20:00',1,1,1,'Schedule seed','Schedule seed'),
    (@r2b,@r2,'Second Trip','["Daily"]','22:45',1,1,2,'Schedule seed','Schedule seed');
  INSERT INTO dbo.BusTripStops(TripId,StopId,StopOrder,ArrivalTime,WaitingMinutes,DepartureTime) VALUES
    (@r1a,@alQuoz,1,'16:20',10,'16:30'),(@r1a,@deira,2,'17:30',10,'17:40'),(@r1a,@uaq,3,'18:50',10,'19:00'),
    (@r1b,@alQuoz,1,'19:05',10,'19:15'),(@r1b,@deira,2,'20:15',10,'20:25'),(@r1b,@uaq,3,'21:35',10,'21:45'),
    (@r2a,@muhaisna,1,'16:40',10,'16:50'),(@r2a,@sharjah,2,'18:00',10,'18:10'),(@r2a,@ajman,3,'18:50',10,'19:00'),
    (@r2b,@muhaisna,1,'19:35',10,'19:45'),(@r2b,@sharjah,2,'20:45',10,'20:55'),(@r2b,@ajman,3,'21:35',10,'21:45');
END
COMMIT TRANSACTION;
