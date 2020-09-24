Feature: Allows dynamic components

    Some components like a list of referrals are hard to render as static markup, and need to be done dynamically.

    To support this, a component can be registered as a "Web Component" for email and rendered via React.

    Developers get the same great JSX rendering experience they're used to, and other parsers can process
    everything as it's just pure HTML.

    Scenario: React email components are rendered without artefacts

        Given a React component registered as "<my-component>" with source
            """
            function MyComponent(){
            return <div>Hello world</div>
            }
            """
        And an HTML email template
            """
            <html>
            <body>
            <my-component></my-component>
            </body>
            </html>
            """
        Then the output html will be
            """
            <html>
            <body>
            <div>Hello world</div>
            </body>
            </html>
            """
