# 🌦️ Angular Weather App — Certification Level 3

This is a weather forecast application enhanced as part of the Angular Level 3 certification project.

🔗 **Live Demo:** https://ancherly.github.io/ng-weather-certification-project/

## 🛠️ How to start

1. Clone the `dev` branch of the repository:

```bash
git clone -b dev https://github.com/ancherly/ng-weather-certification-project.git
cd ng-weather-certification-project
```

2. Install dependencies:

> ⚠️ This project was built using **Angular 17**, so it is recommended to use a compatible Angular CLI version like `17.3.17` to avoid dependency conflicts.
> Alternatively, if you prefer not to change your global CLI version, you can install dependencies with:
>
> ```bash
> npm install --legacy-peer-deps
> ```

```bash
npm install
```

3. Start the development server:

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## ⚙️ Cache Duration Configuration

By default, the cache duration ⏱️ is set to **2 hours** (in development mode).  
To facilitate testing and project demo, the cache duration on the public preview is set to **10 seconds**.

> 🛈 A label has been added in the UI to clearly show the current cache expiration time configured.

🔔 In dev mode, you can change this value from `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  cache: {
    durationMS: 7200000, // (2 hours)
  },
};
```

🔁 Shame in prod mode from `src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  cache: {
    durationMS: 10000, // (10 seconds)
  },
};
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
