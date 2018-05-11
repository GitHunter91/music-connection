select * from userData
join follows on userData.userid = follows.followed_by;
