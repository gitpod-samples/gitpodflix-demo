# Catalog Service - Migrated to Rust

This TypeScript/Node.js catalog service has been migrated to Rust.

## New Location

The Rust implementation can be found in `../../backend-rust/`

## Migration Notes

- All functionality has been ported to Rust using Axum web framework
- Database operations use SQLx for type-safe queries
- Tests have been converted to Rust unit tests
- Docker configuration updated for Rust deployment
- CI/CD pipeline updated to build and test Rust code

## Running the Rust Service

```bash
cd ../../backend-rust
cargo run
```

## Testing

```bash
cd ../../backend-rust
cargo test
```
