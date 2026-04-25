DELETE FROM ResortComments
WHERE Rating < 1 OR Rating > 5;

ALTER TABLE ResortComments
ADD CONSTRAINT check_resort_rating CHECK (Rating >= 1 AND Rating <= 5);

DELETE FROM InstructorComments
WHERE Rating < 1 OR Rating > 5;

ALTER TABLE InstructorComments
ADD CONSTRAINT check_instructor_rating CHECK (Rating >= 1 AND Rating <= 5);

DELIMITER $$

CREATE TRIGGER check_max_students
BEFORE INSERT ON Take
FOR EACH ROW
BEGIN
    DECLARE current_students INT;
    SELECT COUNT(*) INTO current_students
    FROM Take
    WHERE LessonID = NEW.LessonID;
    IF current_students >= (SELECT MaxStudent FROM Lessons WHERE LessonID = NEW.LessonID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Max students limit exceeded for this lesson.';
    END IF;
END$$

DELIMITER ;
