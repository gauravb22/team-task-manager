# Team Task Manager

Team Task Manager is a simple web application for managing project work inside a team. It lets admins create projects, create tasks, assign tasks to members, and track task progress from a dashboard.

I built this project to understand how task assignment works in real teams, especially how different roles need different access. While building it, I wanted to keep the app practical: an admin should be able to create work, members should see what is assigned to them, and the team should be able to track progress without making the workflow complicated.

## Features

- User signup and login
- Admin and member roles
- Admin can create projects
- Admin can create and assign tasks
- Members can view their assigned tasks
- Task status updates: Todo, In Progress, Completed
- Dashboard with task summary counts
- MySQL database support
- Deployed on Railway

## Tech Stack

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- HTML, CSS, JavaScript
- Bootstrap
- Maven
- Railway

## Live URL

https://team-task-manager-production-9735.up.railway.app

## How to Run

Make sure Java 17 and MySQL are installed.

1. Clone the repository:

```bash
git clone https://github.com/gauravb22/team-task-manager.git
cd team-task-manager
```

2. Create a MySQL database:

```sql
CREATE DATABASE task_manager;
```

3. Add local database settings in `local.properties`:

```properties
DB_URL=jdbc:mysql://localhost:3306/task_manager
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

4. Run the project:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

5. Open the app:

```text
http://localhost:8080
```

## Notes

This project is still growing. The next improvements I want to add are edit/delete options for tasks and projects, better user management, and cleaner production-level authentication.
