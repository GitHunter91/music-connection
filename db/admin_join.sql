select userData.display_name, userData.userid, userData.email
from userData
join admin on userData.userid=admin.user_id;