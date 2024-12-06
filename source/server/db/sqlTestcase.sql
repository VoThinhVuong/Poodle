use stumang;

insert into accounts (username, password, role, createdAt, updatedAt)
values
('22127415', '123', 1, current_date(), current_date()),
('staff', '123', 2, current_date(), current_date()),
('admin', '123', 3, current_date(), current_date());

insert into accountinfos
values
(1, 'Nguyen Duc Tin', current_date(), current_date()),
(2, 'Nguyen Duc Staff', current_date(), current_date()),
(3, 'Nguyen Duc Admin', current_date(), current_date());

insert into courses
values
('mathC1', 'linear math', 4, current_date(), current_date()),
('computerA1', 'ProgramTech', 4, current_date(), current_date());

insert into classes
values
('mathC1_1', 'mathC1', 0, 50, 2, '13:30:00', '17:10:00', 'I52', 1, '2024-08-01', '2024-10-01', current_date(), current_date()),
('mathC1_2', 'mathC1', 0, 50, 5, '13:30:00', '17:10:00', 'I34', 1, '2024-08-01', '2024-10-01', current_date(), current_date()),
('comA1_1', 'computerA1', 0, 50, 2, '7:30:00', '11:10:00', 'C34', 1, '2024-08-01', '2024-10-01', current_date(), current_date()),
('comA1_2', 'computerA1', 0, 50, 5, '7:30:00', '11:10:00', 'B11', 1, '2024-08-01', '2024-10-01', current_date(), current_date());

insert into teachings
values
(2, 'mathC1_1', current_date(), current_date()),
(2, 'comA1_2', current_date(), current_date());

insert into open_registrations
values
('mathC1', '2024-08-01', '2024-10-01', current_date(), current_date()),
('computerA1', '2024-08-01', '2024-10-01', current_date(), current_date());