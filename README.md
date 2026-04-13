# BirthHelper — Платформа для поиска родильных услуг

Full-stack веб-приложение для поиска и бронирования услуг родильных домов, клиник и врачей. Агрегатор с личным кабинетом, корзиной, системой отзывов, конфигуратором услуг и admin-панелью. Продакшн: [birthhelper.ru](http://birthhelper.ru)

## Основные модули

### Поиск и каталог
- **Search** — поиск клиник, врачей, консультаций с фильтрацией
- **Clinic Card** — карточки клиник с описанием, рейтингом, услугами
- **Consultation Card** — карточки консультаций с врачами
- **Конфигуратор** — пошаговый выбор: клиника → врач → услуга → таб с деталями

### Личный кабинет (LK)
- **Заказы** — история и управление заказами (order-group, order-list, фильтры)
- **Настройки** — профиль, контакты, аватар
- **Отзывы** — лайки, рейтинги, ответы контрагентов
- **Обратная связь** — feedback с UI для рейтингов

### Admin-панель
- **Dashboard** — таблица с CRUD-редактором для сущностей
- **Entity/Container Engine** — динамическая генерация форм по конфигурации
- **Autocomplete** — поиск сущностей
- **Меню/Подменю** — навигация по разделам

### Корзина и заказы
- **Cart** — корзина услуг, группировка по контрагентам
- **DMS** — интеграция с ДМС-полисами
- **Order Block** — блок заказа с деталями и подтверждением

### Уведомления и диалоги
- **Dialog Module** — анимированные модальные окна (Angular animations)
- **Notifier** — push-уведомления

## Архитектура

```
birthhelper/src/app/
├── main/                    # Landing: ad-slider, преимущества, DMS-форма
├── modules/
│   ├── admin/               # Admin-панель: Dashboard, Editor, Table, LK, Menu
│   ├── auth-module/         # Авторизация, активация, JWT-интерцептор
│   ├── cart/                # Корзина: заказы, DMS, контрагенты
│   ├── configurator/        # Конфигуратор услуг: клиника → врач → услуга
│   ├── dialog/              # Модальные диалоги с анимациями
│   ├── feedback/            # Отзывы: рейтинги, ответы, LK-интеграция
│   ├── menu/                # Навигация
│   ├── profile/             # Профиль пользователя
│   ├── search/              # Поиск: клиники, консультации, фильтры
│   └── utils/               # Утилиты: hasher, digit-separator, random, uniq
├── guards/                  # Auth guards (admin + user)
├── models/                  # Интерфейсы: clinic, doctor, order, user, slot, service...
├── services/                # API, dictionary, entity, image, search, order, slot, routing
└── shared/                  # Paginator, rate-button
```

## Стек технологий

| Технология | Назначение |
|-----------|-----------|
| Angular | SPA-фреймворк, lazy-loaded модули, guards |
| TypeScript | Строгая типизация на всех уровнях |
| SCSS | Стилизация компонентов |
| Angular Animations | Переходы в диалогах и навигации |
| Docker + Nginx | Контейнеризация и деплой |
| DaData | Подсказки адресов |

## Связанные репозитории

| Репозиторий | Назначение |
|------------|-----------|
| [birthhelper_backend](https://github.com/exclusivelogin/birthhelper_backend) | NestJS-style бэкенд: PostgreSQL, auth, REST API |
| [bh_files](https://github.com/exclusivelogin/bh_files) | Файловый сервис |
| [BHBot](https://github.com/exclusivelogin/BHBot) | Telegram-бот уведомлений |

## Запуск

```bash
npm install
ng serve                    # Разработка: localhost:4200
ng build --prod             # Продакшн сборка

# Docker
docker-compose up -d        # Полный стек: frontend + backend + DB
```
