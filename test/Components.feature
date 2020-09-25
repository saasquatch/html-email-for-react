Feature: Allows dynamic components

    Some components like a list of referrals are hard to render as static markup, and need to be done dynamically.

    To support this, a component can be registered as a "Web Component" for email and rendered via React.

    Developers get the same great JSX rendering experience they're used to, and other parsers can process
    everything as it's just pure HTML.

    @automated
    Scenario: React email components are rendered without artefacts

        Given a React component registered as "my-component" with source
            """
            function MyComponent(){
            return <div>Hello world</div>
            }
            """
        Given an HTML template
            """
            <html>
            <head></head>
            <body>
            <my-component></my-component>
            </body>
            </html>
            """
        Then the output html is de-reactified
            """
            <html>
            <head></head>
            <body>
            <div>Hello world</div>

            </body>
            </html>
            """


        Given a React component registered as "special-table" with source
            """
            function SpecialTable(){
            const cols = ["Column A","Column B","Column C"];
            return <table>
            <tbody><tr>
            {cols.map(c=>(<td key={c}>{c}</td>)}
            </tr></tbody>
            </table>
            }
            """
        Given an HTML template
            """
            <html>
            <head></head>
            <body>
            <special-table></special-table>
            </body>
            </html>
            """
        Then the output html is de-reactified
            """
            <html>
            <head></head>
            <body>
            <table>
            <tbody>
            <tr>
            <td>Column A</td>
            <td>Column B</td>
            <td>Column C</td>
            </tr>
            </tbody>
            </table>

            </body>
            </html>
            """


    @automated
    Scenario: React components support children

        Given a React component registered as "my-component" with source
            """
            function MyComponent({children}){
            return <div style={{color:"red"}}>{children}</div>
            }
            """
        Given an HTML template
            """
            <my-component><span>Children</span> inside</my-component>
            """
        Then the output html is de-reactified
            """
            <div style="color:red"><span>Children</span> inside</div>
            """

    @automated
    Scenario: React components support props

        Given a React component registered as "my-component" with source
            """
            function MyComponent({color}){
            return <div style={{color}}>{color}</div>
            }
            """
        Given an HTML template
            """
            <my-component color="red"></my-component>
            """
        Then the output html is de-reactified
            """
            <div style="color:red">red</div>
            """

    @automated
    Scenario: React components support props, children and self-nesting

        Given a React component registered as "my-component" with source
            """
            function MyComponent({color, children}){
            return <div style={{color}}>{children}</div>
            }
            """
        Given an HTML template
            """
            <my-component color="red"><my-component color="blue">Green</my-component></my-component>
            """
        Then the output html is de-reactified
            """
            <div style="color:red"><div style="color:blue">Green</div></div>
            """