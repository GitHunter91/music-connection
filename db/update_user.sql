update userData
set display_name =$2, email =$3, bio =$4
where id = $1
RETURNING *;