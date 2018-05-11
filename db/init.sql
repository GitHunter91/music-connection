drop table if exists userData;
drop table if exists follows;
drop table if exists admin;

create table if not exists userData (table_id serial primary key,display_name text not null UNIQUE, email text not null, bio varChar(250), userID integer not null UNIQUE);
-- create table if not exists follows (table_id serial primary key, followed_by integer references userData(userid) not null, display_name text not null, userid integer not null UNIQUE);
create table if not exists admin (table_id serial, user_id integer primary key not null UNIQUE, display_name varchar(255));

select userData.display_name, userData.userid
from userData
join admin on userData.userid=admin.user_id

alter table admin
add foreign key (user_id) references userData(userid)
