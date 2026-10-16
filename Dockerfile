FROM node:22-alpine AS frontend
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.14-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && useradd --create-home appuser
COPY backend/ backend/
COPY data/ data/
COPY scripts/entrypoint.sh scripts/entrypoint.sh
COPY --from=frontend /build/dist/ frontend/dist/
USER appuser
EXPOSE 8000
CMD ["sh", "scripts/entrypoint.sh"]
