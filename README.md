# ShopCart API — DevSecOps CI/CD Security Pipeline

**Student:** Amanuel Tesfaye  
**Module:** Module Six — CI/CD Security with GitHub Actions

## Endpoints
- `GET /health` — Service health check
- `GET /api/products` — List catalog products
- `GET /api/products/search?q=...` — Search catalog products (parameterized query support when PostgreSQL `DATABASE_URL` is provided at runtime)
- `POST /api/cart` — Validate cart item and compute total price

## Local Commands
```bash
npm ci
npm test
npm run lint
npm run build
```
