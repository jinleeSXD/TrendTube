Below are the stored procedure+trigger we developed for our application. These were ran in GCP through our MySQL instance, and can be called/triggered from the frontend.

### Stored Procedure

This is a stored procedure that considers all channels with a specific title, views, likes, dislikes, and comments in at least 1 video and determines their average number of likes and comments amongst their trending videos, number of trending videos, and a channel rank determined by their likes and number of trending videos.

```sql
DELIMITER //

CREATE PROCEDURE CreativeComp (title VARCHAR(255), viewCount INT, likeCount INT, dislikeCount INT, comments INT, cLimit INT)
BEGIN
    DECLARE myId VARCHAR(255);
    DECLARE myTitle VARCHAR(255);
    DECLARE myViews VARCHAR(255);
    DECLARE myLikes VARCHAR(255);

    DECLARE done int default 0;

    DECLARE channelCursor CURSOR FOR
        SELECT c.id, c.channelTitle, AVG(v.views) as avgViews, AVG(v.likes) as avgLikes
            FROM TrendTube.Video v JOIN TrendTube.Channel c ON (v.channelId=c.id)
            WHERE v.title LIKE title and v.id IN (SELECT id
                                                    FROM TrendTube.Video
                                                    WHERE views > viewCount and likes > likeCount AND dislikes < dislikeCount AND commentCount > comments)
            GROUP BY c.id
            ORDER BY avgViews DESC, avgLikes DESC
            LIMIT cLimit;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    DROP TABLE IF EXISTS FinalTable;

    CREATE TABLE FinalTable (
        ChannelId VARCHAR (255),
        ChannelTitle VARCHAR (255),
        AvgLikes DOUBLE,
        AvgComments INT,
        Category VARCHAR(255),
        NumTrending INT,
        ChannelRank INT
    );

    OPEN channelCursor;

    REPEAT
        FETCH channelCursor INTO myId, myTitle, myViews, myLikes;
        
        IF NOT done THEN
			SET @category = (SELECT categoryTitle FROM (SELECT categoryTitle, COUNT(categoryTitle) as categoryCount FROM TrendTube.Video v JOIN TrendTube.Channel c ON (v.channelId=c.id) JOIN TrendTube.Category c2 ON (categoryId=c2.id)
				WHERE c.id=myId
				GROUP BY categoryTitle
				ORDER BY categoryCount DESC
				LIMIT 1) newTable);
			
			SET @avgLikes = (SELECT ROUND(AVG(v.likes))
				FROM TrendTube.Video v JOIN TrendTube.Channel c ON (v.channelId=c.id) WHERE c.id=myId);

			SET @avgComments = (SELECT ROUND(AVG(v.commentCount))
				FROM TrendTube.Video v JOIN TrendTube.Channel c ON (v.channelId=c.id) WHERE c.id=myId);

			SET @numTrending = (SELECT COUNT(v.id)
				FROM TrendTube.Video v JOIN TrendTube.Channel c ON (v.channelId=c.id) WHERE c.id=myId);

			SET @channelRank = 5;

			IF @avgLikes >= 100000
			THEN
				SET @channelRank = 5;
			END IF;

			IF @avgLikes >= 250000
			THEN
				SET @channelRank = 4;
			END IF;

			IF @avgLikes >= 500000
			THEN
				SET @channelRank = 3;
			END IF;

			IF @avgLikes >= 1000000 AND @numTrending >= 2
			THEN
				SET @channelRank = 2;
			END IF;

			IF @avgLikes >= 1000000 AND @numTrending >= 10
			THEN
				SET @channelRank = 1;
			END IF;

			INSERT INTO FinalTable
				VALUES (myId, myTitle, @avgLikes, @avgComments, @category, @numTrending, @channelRank);
		END IF;
    UNTIL done
    END REPEAT;

    CLOSE channelCursor;

    SELECT * FROM FinalTable ORDER BY ChannelRank, AvgLikes DESC, AvgComments DESC;
END //

DELIMITER ;
```

### Trigger

This trigger creates a new Channel record with a default name if a Video was inserted without an associated Channel.

```sql
DELIMITER //
CREATE TRIGGER ChannelTrig
    AFTER INSERT ON Video
    FOR EACH ROW
    BEGIN
        IF NOT EXISTS(SELECT channelTitle FROM Channel c WHERE c.id=new.channelId)
        THEN
            INSERT INTO Channel(id, channelTitle) VALUES (new.channelId, CONCAT("Default YouTube Channel - ", new.title));
        END IF;
    END
//
DELIMITER ;
```

To list triggers and stored procedure, use:

```sql

Use TrendTube;
Show Triggers;

SELECT 
  ROUTINE_SCHEMA,
  ROUTINE_NAME
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_TYPE = 'PROCEDURE';
```