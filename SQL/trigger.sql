-- trigger 1
DELIMITER $$

CREATE TRIGGER update_instructor_rating_after_insert
AFTER INSERT ON InstructorComments
FOR EACH ROW
BEGIN
    DECLARE avg_rating FLOAT;

    SELECT AVG(Rating) INTO avg_rating
    FROM InstructorComments
    WHERE InstructorID = NEW.InstructorID;

    UPDATE Instructors
    SET AverageRating = avg_rating
    WHERE InstructorID = NEW.InstructorID;
END$$

DELIMITER ;

-- trigger 2
DELIMITER $$

CREATE TRIGGER update_instructor_rating_after_delete
AFTER DELETE ON InstructorComments
FOR EACH ROW
BEGIN
    DECLARE avg_rating FLOAT;
    IF (SELECT COUNT(*) FROM InstructorComments WHERE InstructorID = OLD.InstructorID) = 0 THEN
        SET avg_rating = 0;
    ELSE
        SELECT AVG(Rating) INTO avg_rating
        FROM InstructorComments
        WHERE InstructorID = OLD.InstructorID;
    END IF;
    UPDATE Instructors
    SET AverageRating = avg_rating
    WHERE InstructorID = OLD.InstructorID;
END$$

DELIMITER ;

-- trigger 3
DELIMITER $$

CREATE TRIGGER update_instructor_rating_after_update
AFTER UPDATE ON InstructorComments
FOR EACH ROW
BEGIN
    DECLARE avg_rating FLOAT;

    SELECT AVG(Rating) INTO avg_rating
    FROM InstructorComments
    WHERE InstructorID = NEW.InstructorID;

    UPDATE Instructors
    SET AverageRating = avg_rating
    WHERE InstructorID = NEW.InstructorID;
END$$

DELIMITER ;

-- trigger 4
DELIMITER $$

CREATE TRIGGER update_resort_rating_after_insert
AFTER INSERT ON ResortComments
FOR EACH ROW
BEGIN
    DECLARE avg_rating FLOAT;
    DECLARE initial_avg FLOAT;

    SELECT AverageRating INTO initial_avg
    FROM Resorts
    WHERE ResortID = NEW.ResortID;

    SELECT (initial_avg + SUM(Rating)) / (COUNT(*) + 1) INTO avg_rating
    FROM ResortComments
    WHERE ResortID = NEW.ResortID;
    UPDATE Resorts
    SET AverageRating = avg_rating
    WHERE ResortID = NEW.ResortID;
END$$

DELIMITER ;

-- trigger 5
DELIMITER $$

CREATE TRIGGER update_resort_rating_after_delete
AFTER DELETE ON ResortComments
FOR EACH ROW
BEGIN
    DECLARE avg_rating FLOAT;

    IF (SELECT COUNT(*) FROM ResortComments WHERE ResortID = OLD.ResortID) = 0 THEN
        SET avg_rating = 0;
    ELSE
        SELECT AVG(Rating) INTO avg_rating
        FROM ResortComments
        WHERE ResortID = OLD.ResortID;
    END IF;
    
    UPDATE Resorts
    SET AverageRating = avg_rating
    WHERE ResortID = OLD.ResortID;
END$$

DELIMITER ;

-- trigger 6
DELIMITER $$

CREATE TRIGGER update_resort_rating_after_update
AFTER UPDATE ON ResortComments
FOR EACH ROW
BEGIN
    DECLARE avg_rating FLOAT;

    SELECT AVG(Rating) INTO avg_rating
    FROM ResortComments
    WHERE ResortID = NEW.ResortID;

    UPDATE Resorts
    SET AverageRating = avg_rating
    WHERE ResortID = NEW.ResortID;
END$$

DELIMITER ;

