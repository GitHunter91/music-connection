insert into userData ( display_name, email, bio , userID )
values ( $1 , $2, $3, $4 )
returning *;