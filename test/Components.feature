Feature: Allows dynamic components

    Some components like a list of referrals are hard to render as static markup, and need to be done dynamically.

    To support this, a component can be registered as a "Web Component" for email and rendered via React.

    Developers get the same great JSX rendering experience they're used to, and other parsers can process
    everything as it's just pure HTML.


    Background: Javascript imports

        For simplicity of understanding, you can read the javascript component examples as if these variables are imported

        Given "React" is imported from "react"
        And "useContext" is imported from "html-email-for-react"
        And "raw" is imported from "html-email-for-react"

    @automated
    Scenario: React email components are rendered without artefacts

        The rendering procss will remove "my-component" from the HTML, leaving no trace to trip up email clients

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

    @automated
    Scenario: React components support logic and nested components

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

        Plain HTML elements can be just used in children components

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

        Props are transformed into from HTML standards into their React equivalents (e.g. style and className)

        Given a React component registered as "my-component" with source
            """
            function MyComponent({style, color, className}){
            const nextStyle = {...style, color}
            return <div className={className} style={nextStyle}>{color}</div>
            }
            """
        Given an HTML template
            """
            <my-component color="red" class="rouge" style="font-size:12px;">337341200
            """
        Then the output html is de-reactified
            """
            <div style="font-size:12px;color:red" class="rouge">red</div>
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

    @automated
    Scenario: React components can access global data

        Given a React component registered as "my-component" with source
            """
            function(){
            const {name} = useData();
            return <div>{name}</div>;
            }
            """
        Given an HTML template
            """
            <my-component>532235300
            """
        And global data
            """
            {
                "name": "Jorghan"
            }
            """
        Then the output html is de-reactified
            """
            <div>Jorghan</div>
            """


    @automated
    Scenario: Raw component can be used to render comments

        Given a React component registered as "my-component" with source
            """
            function(){
            const {name} = useData();
            return <raw.div>{`<!--MSO-->`}{name}</raw.div>;
            }
            """
        Given an HTML template
            """
            <my-component></my-component>
            """
        And global data
            """
            {
                "name": "Jorghan"
            }
            """
        Then the output html is de-reactified
            """
            <div><!--MSO-->Jorghan</div>
            """