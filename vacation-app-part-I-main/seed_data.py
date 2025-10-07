from datetime import datetime, date
from models.user_model import User
from models.role_model import Role
from models.country_model import Country
from models.vacation_model import Vacation
from werkzeug.security import generate_password_hash


def roll_to_future(start_date_str: str, end_date_str: str):
    start = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    today = date.today()
    while start < today:
        start = date(start.year + 1, start.month, start.day)
        end = date(end.year + 1, end.month, end.day)
    return start.isoformat(), end.isoformat()


def is_valid(start_date_str: str, end_date_str: str, price: float) -> bool:
    try:
        start = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        print("Invalid date format.")
        return False

    if price < 0 or price > 10000:
        print(f"Invalid price: {price}")
        return False
    if end < start:
        print(f"Invalid date range: {start_date_str} to {end_date_str}")
        return False
    return True


def vacation_exists(description: str) -> bool:
    try:
        all_vacations = Vacation.get_all()
    except Exception:
        return False
    for v in all_vacations:
        if str(v.get("description", "")).lower() == description.lower():
            return True
    return False


def get_vacation_by_description(description: str):
    try:
        all_vacations = Vacation.get_all()
    except Exception:
        return None
    for v in all_vacations:
        if str(v.get("description", "")).lower() == description.lower():
            return v
    return None


# Ensure tables exist before inserting data
Role.create_table()
User.create_table()
Country.create_table()
Vacation.create_table()

Role.insert_default_roles()
Country.insert_default_countries()

# Upsert users with hashed passwords
def upsert_user(first_name: str, last_name: str, email: str, password_plain: str, role_id: int):
    existing = User.get_user_by_email(email)
    hashed = generate_password_hash(password_plain, method='pbkdf2:sha256')
    if existing:
        User.update_user(existing['user_id'], first_name, last_name, email, hashed, role_id)
    else:
        User.create_user(first_name, last_name, email, hashed, role_id)

upsert_user(
    first_name="Laura",
    last_name="Admin",
    email="laura-admin@johnbryce.com",
    password_plain="@dmin!77",
    role_id=1
)

upsert_user(
    first_name="Charles",
    last_name="Kent",
    email="ckent@gmail.com",
    password_plain="mypass!!word9",
    role_id=2
)

vacations = [
    (10, "Thailand", "Beach in Thailand (2026)",         "2026-01-10", "2026-01-20", 1200, "thailand.webp"),
    (2,  "Spain",    "Cultural tour in Spain (2026)",    "2026-02-05", "2026-02-15", 1500, "spain.jpeg"),
    (3,  "France",   "Wine tasting in France (2026)",    "2026-03-01", "2026-03-08", 1800, "france.jpeg"),
    (6,  "Argentina","Hiking in Argentina (2026)",       "2026-04-10", "2026-04-20",  950, "argentina.jpg"),
    (4,  "Greece",   "Island hopping in Greece (2026)",  "2026-05-15", "2026-05-25", 2100, "greece.jpg"),
    (7,  "Brazil",   "Adventure in Brazil (2026)",       "2026-06-01", "2026-06-10", 1400, "brazil.jpg"),
    (5,  "Japan",    "Temples in Japan (2026)",          "2026-07-20", "2026-07-30", 3000, "japan.avif"),
    (1,  "Italy",    "Relaxation in Italy (2026)",       "2026-08-01", "2026-08-10", 1600, "venice.webp"),
    (8,  "Mexico",   "Food tour in Mexico (2026)",       "2026-09-15", "2026-09-25", 1000, "mexico.webp"),
    (9,  "Portugal", "Coastal trip in Portugal (2026)",  "2026-10-01", "2026-10-12", 1100, "portugal.jpeg"),
    (10, "Thailand", "Night markets in Thailand (2026)", "2026-11-05", "2026-11-15",  950, "thailand.webp"),
    (2,  "Spain",    "Art and history in Spain",  "2026-12-20", "2026-12-30", 1250, "spain.jpeg"),
]


inserted, skipped = 0, 0

for v in vacations:
    country_id, destination, description, start_date, end_date, price, image = v
    start_date, end_date = roll_to_future(start_date, end_date)

    existing = get_vacation_by_description(description)

    if not is_valid(start_date, end_date, price):
        print(f"Vacation '{description}' is invalid. Skipping.")
        skipped += 1
        continue

    try:
        if existing:
            # Update existing record to refresh image/fields
            Vacation.update_vacation(
                vacation_id=existing['vacation_id'],
                country_id=country_id,
                destination=destination,
                description=description,
                start_date=start_date,
                end_date=end_date,
                price=price,
                image_filename=image
            )
            print(f"Updated: {description}")
            inserted += 1
        else:
            # Insert new
            result = Vacation.add_vacation(
                country_id=country_id,
                destination=destination,
                description=description,
                start_date=start_date,
                end_date=end_date,
                price=price,
                image_filename=image
            )
            print(result.get('message', f"Inserted: {description}"))
            inserted += 1
    except Exception as e:
        print(f"Error inserting/updating '{description}': {e}")
        skipped += 1

print(f"\nSeed completed. Inserted: {inserted}, Skipped: {skipped}")



#     SELECT 
#     vacations.vacation_id,
#     vacations.description,
#     vacations.start_date,
#     vacations.end_date,
#     vacations.price,
#     vacations.image_filename,
#     countries.country_name
# FROM vacations
# LEFT JOIN countries ON vacations.country_id = countries.country_id;


# DELETE FROM likes;

# admin credentials:
# Email: laura-admin@johnbryce.com
# Password: @dmin!77
# role_id: 1 (admin)

# user credentials:
# Email: lauragarfield@gmail.com
# Password: garfield
# role_id: 2 (user)


# ckent@gmail.com
# mypass!!word9
# role_id: 2 (user)
