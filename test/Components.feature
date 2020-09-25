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
            {cols.map(c=>(<td>{c}</td>)}
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
