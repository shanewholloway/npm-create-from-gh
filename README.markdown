# npm init from-gh

Initialize a project from existing github.com repositories using `npm init from-gh <owner>/<repo>`

## Usage

```
npm init from-gh <<from>> <<to>>?
```

If `<<to>>` is not provided, it will default to `<<repo>>`.


Options for `<<from>>` corresponding to `https://github.com/<owner>/<repo>`:

- `<owner>/<repo>`
- `<owner>/<repo>#<branch>`
- `<owner>/<repo>/<path>`
- `<owner>/<repo>/<path>#<branch>`


Using `npx create-from-gh` instead:

```

npx create-from-gh <<from>> <<to>>?
```

## License

MIT

Forked from [ekaragodin/create-from](https://github.com/ekaragodin/create-from) under MIT license on November 27th 2019 to remove yarn assumptions and expand on pattern.

