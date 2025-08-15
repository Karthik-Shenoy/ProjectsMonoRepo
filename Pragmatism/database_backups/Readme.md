### Migrating database 
- `at local machine`: (`pg_dump -U test -d Pragmatism -f PragmatismData.sql -v`)
- push to git hub, and pull at remote
- copy the `database_backup.sql` file to a folder which postgresql can access
- `at remote`: 
    - `sudo -i -u postgres`
    - go into the backup directory
    - `psql -U postgres -d Pragmatism -f PragmatismData.sql`