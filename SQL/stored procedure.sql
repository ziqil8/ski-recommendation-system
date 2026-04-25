DELIMITER $$

DROP PROCEDURE IF EXISTS AdvancedResortQueries$$

CREATE PROCEDURE AdvancedResortQueries(IN QueryType INT)
BEGIN
        ELSEIF QueryType = 1 THEN
        SELECT *
        FROM Resorts R
        JOIN Countries C ON R.CountryName = C.CountryName
        WHERE R.IntermediateSlope > 10
          AND C.SnowfallAmount > (SELECT AVG(SnowfallAmount) FROM Countries)
        ORDER BY R.IntermediateSlope DESC
        LIMIT 15;

    ELSEIF QueryType = 2 THEN
        SELECT *
        FROM Resorts R
        JOIN Countries C ON R.CountryName = C.CountryName
        WHERE R.BeginnerSlope > 10
          AND C.SnowfallAmount > (SELECT AVG(SnowfallAmount) FROM Countries)
        ORDER BY R.BeginnerSlope DESC
        LIMIT 15;

    ELSEIF QueryType = 3 THEN
        SELECT *
        FROM Resorts R
        JOIN Countries C ON R.CountryName = C.CountryName
        WHERE R.DifficultSlope > 10
          AND C.SnowfallAmount > (SELECT AVG(SnowfallAmount) FROM Countries)
        ORDER BY R.DifficultSlope DESC
		LIMIT 15;
	ELSE
		SELECT 'Invalid QueryType. Please select between 1 and 3.' AS ErrorMessage;
	END IF;
END$$
DELIMITER ;
    
