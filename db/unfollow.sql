delete from follows
where userID = $1 and followed_by=$2;