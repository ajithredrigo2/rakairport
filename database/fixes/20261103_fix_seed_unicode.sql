/* Run once only if the initial seed displayed question marks instead of arrows. */
UPDATE dbo.BusRoutes
SET Description = CASE Name
  WHEN N'Route 1' THEN N'Dubai Al Quoz → Dubai Deira → Umm Al Quwain → RAK Airport'
  WHEN N'Route 2' THEN N'Dubai Muhaisna 2 → Sharjah → Ajman → RAK Airport'
  ELSE Description
END,
UpdatedAt = SYSUTCDATETIME(), UpdatedBy = N'Schedule seed correction'
WHERE Name IN (N'Route 1', N'Route 2');
