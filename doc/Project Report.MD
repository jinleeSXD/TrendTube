# Stage 6: Project Report

## 1. Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).
We did not have any changes in the direction of our project. We were able to build out functionality that allowed users to view, data regarding the trending videos, query subsets of the dataset and view specific data from the database in tabular form, mark some channels as their favorites and save them into database, and query video data only from the selected favorite channels. We also added interactive data visualizations.

## 2. Discuss what you think your application achieved or failed to achieve regarding its usefulness.
The team has achieved most of the functionality that we planned initially. First of all, users can simply search videos by keywords; select and manage their favorite channels; and see other users registered for the application. The application can display channels that contain trending videos based on certain criteria through visualization. This can help the users to understand different properties of videos that are trending on Youtube. Moreover, users are able to process some advanced search query from a simple interface to search videos and channels with specific properties. The team ended up not implementing the analysis feature using machine learning. We decided that this task not only requires a significant amount of work, but also, is out of the scope of this course. Therefore, we instead focused more on the interface design/database management.

## 3. Discuss if you changed the schema or source of the data for your application
We did not change the schema or source of the data. This is because there was no need to change the schema or source of the data in order to fulfull the project functionalities specified in the original Project Proposal.

## 4. Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design? 
We changed some data types and names for some of the columns since there were some issues with the names when we made the database in SQL workbench.
We also added some deletion/update cascading to some tables, such as when we delete a user or delete a user's stored favorites. We did this in order to remain consistent with the data stored in our database and ensure that the relationships between entities remain as specified in earlier stages.

## 5. Discuss what functionalities you added or removed. Why?
We added functionality for user input in the advanced queries to increase usability and effectiveness of the advanced queries. As advised by our TA, they would be somewhat useless if the user couldn't choose parameters.

## 6. Explain how you think your advanced database programs complement your application.
The advanced database programs allow users to find patterns in videos that are trending on YouTube which is the main purpose of the application. 
We utilized the stored procedure by calling it from the frontend and using that data for the data visualizations that were a part of our Creative Component, through which the user can find patterns in videos that are trending.
We utilized the trigger by adding channels records for new trending videos added to the database by a user, thus ensuring that the new trending video and its corresponding channel can be searchable by the user.

## 7. Each team member should describe one technical challenge that the team encountered. This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project. 
Matthew B: A technical challenge we encountered was changing the datatype of columns in the dataset after we had already built the tables/database and deployed the database on GCP and SQL workbench. The solution we found was some commands from the documentation for GCP that allow you to retroactively change data types for columns in the database. The specific command that worked is “ALTER TABLE table_name MODIFY column_name new_data_type;”.

Jin: Since the application handles different types of data, there were situations where intrinsic data types defined in Javascript were not sufficient to define different properties of data and explain them. For example, when obtaining the list of videos and mapping them on a page, considering them as a list of JSON objects was extremely inefficient for tracking their properties. Therefore, we have implemented the application using Typescript, and created user-defined types to simplify the codes and highlight the significant properties.

Ashay: A technical challenge I faced was implementing the stored procedure. After writing the stored procedure, I ran into some syntax errors that I resolved by searching for solutions on StackOverflow and the class lecture notes. The solution was to add a DELIMITER. Then, I faced another challenge where the stored procedure never finished running within 30 seconds. To solve this challenge, I realized I needed to add a LIMIT to the stored procedure, which allowed the user to specify how many rows are iterated through in the cursor within the stored procedure. This worked and I was able to connect the stored procedure functionality to the frontend’s creative component.

Soham: A technical challenge we faced was designing the API endpoints in a way that they could be easily integrated into the frontend with the least amount of HTTP requests. For example, this was especially relevant when implementing features like authentication. We decided to leverage cookies to store our jwt secrets on the client side to automatically attach them with future requests. This helped keep our code more clean and secure. 

## 8. Are there other things that changed comparing the final application with the original proposal?
We added a feature that allows users to view other users that are using the application. Users can see the name, username, and email of other users that use the application. This feature was added as a "Friend" feature and can be further improved by the feature of friending other users.

## 9. Describe future work that you think, other than the interface, that the application can improve on
We could improve upon query optimization because the tables in the database are very large. Also, the database management system can be connected to the internet and changed to reflect the changes in data in real-time. For example, if a video with unknown channel ID is added, the trigger creates a new dummy channel with default name and adds it to the channel database. A future work can aim to let the application search for the actual channel information for the new video online.
We could also expand the feature that allows users to view other users by allowing users to friend other people and view their favorite channels.

## 10. Describe the final division of labor and how well you managed teamwork.
We split the project into backend and frontend teams and then if one team had less work or finished early they would help the other team. Ashay and Matt worked on the backend and Soham and Jin worked on the frontend.
For non-coding stuff we just tried to divide and conquer as fairly as possible. Using this methodology, we managed teamwork extremely well. We also did weekly checkups during class and async on Discord.
