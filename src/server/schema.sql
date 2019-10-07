CREATE TABLE employees (employee_id SERIAL PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE buildings (building_id SERIAL PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE shifts (shift_id BIGSERIAL PRIMARY KEY, building_id INT REFERENCES buildings(building_id) NOT NULL, start TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, is_show BOOL NOT NULL DEFAULT false, employee_id INT REFERENCES employees(employee_id) );

INSERT INTO employees (name) VALUES ('zach'), ('alice'), ('bob'), ('charlie'), ('dave');
INSERT INTO buildings (name) VALUES ('abravanel hall'), ('capitol'), ('delta hall'), ('regent street'), ('rose wagner');
INSERT INTO shifts (building_id, start, "end", employee_id) VALUES 
  ((SELECT building_id from buildings where name='abravanel hall'), '2019-10-07 09:45', '2019-10-07 14:00', (select employee_id from employees where name='zach')),
  ((SELECT building_id from buildings where name='delta hall'), '2019-10-08 09:45', '2019-10-08 14:00', (select employee_id from employees where name='charlie')),
  ((SELECT building_id from buildings where name='capitol'), '2019-10-09 13:45', '2019-10-09 18:00', (select employee_id from employees where name='bob')),
  ((SELECT building_id from buildings where name='abravanel hall'), '2019-10-07 09:45', '2019-10-07 14:00', (select employee_id from employees where name='dave'));