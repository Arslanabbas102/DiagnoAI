# DiagnoAI

AI-assisted diagnostics for seven major diseases, connected to real doctors.

DiagnoAI is a full-stack healthcare web app. Patients can run AI screenings on their lab values or medical images, check their symptoms, and book appointments with verified doctors. Doctors manage their profile and appointments, and admins approve doctors and oversee users and bookings.

> AI results are informational only and are not a medical diagnosis.

## Features

- **AI tests**: diabetes, heart disease, kidney disease, liver disease, breast cancer (from lab values), plus malaria and pneumonia (from images).
- **Symptom checker (HealthPredict)**: pick your symptoms and get a likely condition with precautions, medications, diet and workout suggestions.
- **Doctors**: browse and search doctors, read reviews and book appointments (Stripe checkout).
- **Accounts**: patient, doctor and admin roles with JWT authentication and password reset.
- **Admin dashboard**: statistics, doctor approval, user and booking management.

## How the AI works

Each prediction request goes from the React app to the Express API, which starts a Python script that loads a pre-trained model from `backend/aimodels/` and returns its prediction.

| Test | Model | Input |
|---|---|---|
| Diabetes, heart, kidney, liver, breast cancer | Random forest (scikit-learn) | Lab values |
| Malaria | Convolutional neural network (TensorFlow/Keras) | Cell image |
| Pneumonia | Convolutional neural network (TensorFlow/Keras) | Chest X-ray |
| Symptom checker | Linear SVM (scikit-learn) | 132 symptoms → 41 conditions |

## Tech stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Swiper, ApexCharts
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Stripe, Nodemailer
- **AI/ML**: Python 3.7, scikit-learn, TensorFlow/Keras, pandas, NumPy, Pillow

## Project structure

```
backend/    Express API, Python prediction scripts, AI models (aimodels/)
frontend/   React + Vite + Tailwind web app
```

## Getting started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local install, or Docker: `docker run -d --name diagnoai-mongo -p 27017:27017 mongo:7`)
- Python 3.7. The saved models only load with the pinned library versions. The easiest way to get Python 3.7 is [uv](https://github.com/astral-sh/uv) version 0.4.30:

  ```bash
  pip install "uv==0.4.30"
  uv python install 3.7
  ```

### 1. Clone

```bash
git clone https://github.com/<your-username>/diagnoai.git
cd diagnoai
```

### 2. Backend

```bash
cd backend
npm install

# Python environment for the AI models
uv venv --python 3.7 .venv
uv pip install --python .venv/bin/python -r requirements.txt

# Environment variables
cp .env.example .env   # then edit JWT_SECRET_KEY (and Stripe/email keys if needed)

npm start              # API on http://localhost:5000
```

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev            # app on http://localhost:5173
```

The frontend calls the API at `http://localhost:5000/api/v1` by default. If your backend runs on another port, create `frontend/.env.local` with:

```text
VITE_API_URL=http://localhost:<port>/api/v1
```

## Environment variables (backend/.env)

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | yes | API port (default 5000) |
| `MONGO_URL` | yes | MongoDB connection string |
| `JWT_SECRET_KEY` | yes | Secret used to sign login tokens |
| `CLIENT_SITE_URL` | yes | Frontend URL, used for Stripe redirects |
| `PYTHON` | yes | Python interpreter for the AI models (`.venv/bin/python`) |
| `STRIPE_SECRET_KEY` | no | Enables appointment payments |
| `APP_PASS` | no | Gmail app password for the contact form |

## Credits

DiagnoAI is based on [AI-MedLab](https://github.com/abdul-wahab619/AI-MedLab) by [Abdul Wahab](https://github.com/abdul-wahab619) and [Nafeesa Shehzadi](https://github.com/nafeesa-shehzadi), released under the MIT License.

This version adds a complete UI redesign, a working Linux/Python setup, and fixes to the prediction pipeline.

## License

[MIT](LICENSE)
