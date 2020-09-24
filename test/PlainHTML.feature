Feature: Renders plain HTML emails

    The baseline feature for the React email renderer is that it support plain HTML emails.

    This makes it compatible with the output of other templating systems, such as;
    - MJML
    - Bee Plugin templates
    - Mailchimp templates

    @automated
    Scenario: Plain HTML emails are processed unchanged
        Given an HTML template
            """
            <html>
            <body>
            <div>
            <table><tbody><tr><td>I am content</td></tr></tbody></table>
            </div>
            </body>
            </html>
            """
        Then the output html is unchanged
            """
            <html>
            <body>
            <div>
            <table><tbody><tr><td>I am content</td></tr></tbody></table>
            </div>
            </body>
            </html>
            """

    Scenario: Bad HTML is purified

        This uses DomPurify that is well supported and has more cases described

        Given an HTML template with bad html
            """
            <html>
            <body>
            <div>No closing tag
            </body>
            </html>
            """
        Then the output html is purified
            """
            <html>
            <body>
            <div>No closing tag</div>
            </body>
            </html>
            """
