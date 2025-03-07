drop table if exists lab2_messages;
drop table if exists lab2_users_in_conversation;
drop table if exists lab2_conversations;
drop table if exists lab2_users;

create table lab2_users
(
    user_id int primary key auto_increment,
    username varchar(64) not null
);

create table lab2_conversations
(
    convo_id int primary key auto_increment,
    convo_name varchar(30) not null default 'Chat',
    created_on timestamp not null default now()
);

create table lab2_users_in_conversation
(
    user_id int references lab2_users(user_id),
    convo_id int references lab2_conversations(convo_id),
    primary key (user_id, convo_id)
);

create table lab2_messages
(
    message_id int primary key auto_increment,
    convo_id int references lab2_conversations(convo_id),
    user_id int references lab2_users(user_id),
    sent_time timestamp not null default now(),
    message varchar(140)
);

insert into lab2_users (user_id, username) values (1, "default user");