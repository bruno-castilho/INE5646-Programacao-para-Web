export function Dom() {
  return (
    <>
      <section>
        <h2>Estrutura DOM do Compilador PHP</h2>

        <pre
          dangerouslySetInnerHTML={{
            __html: `
        html
        ├── head
        │   ├── title
        │   ├── meta (charset)
        │   ├── link 
        │   └── link 
        └── body
            ├── header
            │   ├── img
            │   ├── h1
            │   └── nav
            │       └── ul
            │           └── li 
            ├── div
            │   ├── aside
            │   │   ├── h3
            │   │   ├── section
            │   │   ├── section
            │   │   ├── section 
            │   │   ├── section 
            │   │   └── section 
            │   └── div
            │       ├── div.menu
            │       │   ├── button
            │       │   ├── button
            │       │   └── button
            │       └── div
            │           ├── div
            │           │   └── textarea
            │           └── div
            │               └── pre
            └── footer
                └── address
                    ├── h4
                    ├── p 
                    ├── p 
                    └── p `,
          }}
        />
      </section>
    </>
  )
}
