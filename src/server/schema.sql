CREATE TABLE employees (employee_id SERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE buildings (building_id SERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE shifts (shift_id BIGSERIAL PRIMARY KEY, building_id INT REFERENCES buildings(building_id) NOT NULL, start TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, is_show BOOL NOT NULL DEFAULT false, employee_id INT REFERENCES employees(employee_id) );

-- Some dummy data for dev
INSERT INTO employees (name) VALUES ('zach'), ('alice'), ('bob'), ('charlie'), ('dave');
INSERT INTO buildings (name) VALUES ('abravanel'), ('capitol'), ('delta'), ('regent'), ('rose');
INSERT INTO shifts (building_id, start, "end", employee_id) VALUES 
  ((SELECT building_id from buildings where name='abravanel'), '2019-10-14 09:45', '2019-10-14 14:00', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='delta'), '2019-10-14 09:45', '2019-10-14 14:00', (select employee_id from employees where name='charlie')),
  ((SELECT building_id from buildings where name='capitol'), '2019-10-14 13:45', '2019-10-14 18:00', (select employee_id from employees where name='bob')),
  ((SELECT building_id from buildings where name='abravanel'), '2019-10-14 09:45', '2019-10-14 14:00', (select employee_id from employees where name='dave')),
  ((SELECT building_id from buildings where name='regent'), '2019-10-16 09:45', '2019-10-16 14:00', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='regent'), '2019-10-16 13:45', '2019-10-16 18:00', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='rose'), '2019-10-17 13:45', '2019-10-17 18:00', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='rose'), '2019-10-17 17:45', '2019-10-17 20:00', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='capitol'), '2019-10-19 17:45', '2019-10-19 20:30', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='delta'), '2019-10-20 09:45', '2019-10-20 14:00', (select employee_id from employees where name='zach'));

-- Handy queries to clear employee and shift tables and restart sequences
alter sequence shifts_shift_id_seq restart with 1;
alter sequence employees_employee_id_seq restart with 1;
delete from shifts where true;
delete from employees where true;