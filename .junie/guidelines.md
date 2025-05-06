# Birthhelper Project Guidelines

This document provides essential information for developers working on the Birthhelper project.

## Project Overview

Birthhelper is an Angular 13 application with Docker support. The project uses:
- Angular 13.2.5
- RxJS 6.6.6
- Bootstrap 4.6.0
- Leaflet for maps
- Jasmine/Karma for unit testing
- Protractor for e2e testing
- ESLint and Prettier for code quality

## Build and Configuration Instructions

### Environment Setup

The project uses environment variables for configuration. These are managed through the `env.js` and `envgen.js` files:

1. The `env.js` file contains configuration variables:
   - `baseUrl`: Base URL for the application
   - `fileServer`: URL for file server
   - `backend`: URL for backend services
   - `static`: URL for static assets

2. During build, the `envgen.js` script populates these values from environment variables:
   - `BASE_URL`
   - `FILE_URL`
   - `BACK_URL`
   - `STATIC_URL`

### Development Server

To run the development server:

```bash
# Standard development with proxy configuration
npm run start

# Run with local configuration
npm run start:local

# Run with remote configuration
npm run start:remote

# Run with localhost configuration
npm run start:localhost
```

### Building the Application

To build the application for production:

```bash
npm run build
```

This command:
1. Runs the environment generation script
2. Builds the Angular application with production configuration

### Docker Support

The project includes Docker support with the following commands:

```bash
# Build Docker image
npm run docker:build

# Publish Docker image
npm run docker:publish

# Run Docker container
npm run docker:run
```

## Testing Information

### Unit Testing

The project uses Jasmine and Karma for unit testing:

1. **Running Tests**:
   ```bash
   # Run all tests
   npm test

   # Run specific tests
   npm test -- --include=path/to/test.spec.ts
   ```

2. **Test Configuration**:
   - Tests are configured in `karma.conf.js`
   - Uses Chrome browser for running tests
   - Includes code coverage reporting

3. **Writing Tests**:
   - Tests should be placed in the same directory as the file being tested
   - Test files should have the `.spec.ts` suffix
   - Follow the standard Angular testing patterns using TestBed

Example unit test:

```typescript
import { TestBed } from '@angular/core/testing';
import { ExampleService } from './example.service';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExampleService]
    });
    service = TestBed.inject(ExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform expected operation', () => {
    const result = service.someMethod();
    expect(result).toEqual(expectedValue);
  });
});
```

### End-to-End Testing

The project uses Protractor for e2e testing:

1. **Running E2E Tests**:
   ```bash
   npm run e2e
   ```

2. **Test Configuration**:
   - Tests are configured in `protractor.conf.js`
   - Uses Chrome browser for running tests
   - Tests are located in the `e2e` directory

3. **Writing E2E Tests**:
   - Use the Page Object pattern to encapsulate page interactions
   - Test files should have the `.e2e-spec.ts` suffix
   - Page objects should have the `.po.ts` suffix

Example e2e test:

```typescript
import { AppPage } from './app.po';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display expected content', () => {
    page.navigateTo();
    expect(page.getElementText()).toEqual('Expected Text');
  });
});
```

## Code Style and Development Guidelines

### Code Style

The project uses ESLint and Prettier for code quality and formatting:

1. **ESLint Configuration**:
   - Extends Angular ESLint recommended rules
   - Integrates with Prettier for formatting

2. **Prettier Configuration**:
   - Uses Angular parser for HTML files
   - Uses default Prettier rules for other files

3. **Running Linting**:
   ```bash
   npm run lint
   ```

### Project Structure

- `src/app`: Application code
  - `modules`: Feature modules
  - `shared`: Shared components, services, and utilities
  - `main`: Main application components
- `src/assets`: Static assets
- `src/environments`: Environment configuration
- `e2e`: End-to-end tests
- `docker`: Docker configuration

### Known Issues

1. Some test files may be outdated and not match the current implementation. When working with tests:
   - Check that tests match the current implementation
   - Update tests as needed when modifying components or services

2. The project uses SCSS for styling, but the Angular CLI may expect a `styles.css` file during testing. If you encounter errors related to missing style files, ensure both SCSS and CSS files exist.

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Protractor Documentation](https://www.protractortest.org/)
