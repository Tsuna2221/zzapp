import avatar_model, event_model, media_model, request_model, user_model, budconfig_model, kits_model, sets_model
import time, bcrypt, random, string

random_string = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(30))

f = open("../gmqs.txt", "w")
f.write(random_string)
f.close()

avatar_model.db.create_all()
event_model.db.create_all()
media_model.db.create_all()
request_model.db.create_all()
user_model.db.create_all()
budconfig_model.db.create_all()
kits_model.db.create_all()
sets_model.db.create_all()


#Criar admin
password = "1234"
hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10))

admin = user_model.User(
    'Admin',
    'admin@test.com',
    hashed_pass,
    'admin',
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    time.time(),
    time.time(),
    None,
    None,
    None
)

user_model.db.session.add(admin)
user_model.db.session.commit()
user_model.db.session.close()

avatar = avatar_model.Avatar(1, None, None)
avatar_model.db.session.add(avatar)
avatar_model.db.session.commit()
avatar_model.db.session.close()

config = budconfig_model.BudConfig(100,30,10,6,6,"50/100","100/250","250/400","350/550",1,3,5,8)
budconfig_model.db.session.add(config)
budconfig_model.db.session.commit()
budconfig_model.db.session.close()

kits = kits_model.Kits(120, 300, 300, 1000, 600, 900, 500, 300, 550, 300, 300, 150, 150, 65)
kits_model.db.session.add(kits)
kits_model.db.session.commit()
kits_model.db.session.close()

sets = sets_model.Sets("1/3", "3/5", "2/1", "6/10", "5/7", "5/1", "4/5", "4/4", "2/4", "8/5", "8/3", "3/3", "3/1")
sets_model.db.session.add(sets)
sets_model.db.session.commit()
sets_model.db.session.close()