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
            <head></head>
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
            <head></head>
            <body>
            <div>
            <table><tbody><tr><td>I am content</td></tr></tbody></table>
            </div>
            </body>
            </html>
            """

    @automated
    Scenario: Bad HTML is purified

        This uses DomPurify that is well supported and has more cases described

        Given an HTML template with bad html
            """
            <html>
            <head></head>
            <body>
            <div>No closing tag</body>
            </html>
            """
        # NOTE: Output is written to be whitepsace / newline sensitive
        Then the output html is purified
            """
            <html>
            <head></head>
            <body>
            <div>No closing tag
            </div>
            </body>
            </html>
            """



    @automated
    Scenario Outline: Subdocument fragments render
        # Given an HTML template "<fragment>"
        # Then the output html is "<fragment>"
        Given an HTML template
            """
            <fragment>
            """
        Then the output html is unchanged
            """
            <fragment>
            """
        Examples:
            | fragment                                              |
            | Just text                                             |
            | <span>Inline</span>                                   |
            | <div>Block</div>                                      |
            | <img src="example.png">                               |
            | <br>                                                  |
            | <h1>Heading 1 </h1>                                   |
            | <h2>Heading 2 </h2>                                   |
            | <h3>Heading 3 </h3>                                   |
            | <h4>Heading 4 </h4>                                   |
            | <h5>Heading 5 </h5>                                   |
            | <h6>Heading 6 </h6>                                   |
            | <p> Paragraph... </p>                                 |
            | <em> Emphasis... </em>                                |
            | <b> Bold... </b>                                      |
            | <i> Italics... </i>                                   |
            | <small> Small... </small>                             |
            | <u> Underline... </u>                                 |
            | <strike> Strike through... </strike>                  |
            | <li> List item... </li>                               |
            | <ol> Ordered list... </ol>                            |
            | <ul> Unordered list... </ul>                          |
            | <center> Center </center>                             |
            | <hr>                                                  |
            | <table><tbody><tr><td>Table</td></tr></tbody></table> |

    # TODO: Make sure we know why this is standardized and that it works in email browsers
    # (i believe React standardizes on HTML5  with no closing slash)
    @automated
    Scenario Outline: Subdocument is standardized on HTML5?
        Given an HTML template
            """
            <fragment>
            """
        Then the output html is standardized
            """
            <output>
            """
        Examples:
            | fragment                 | output                  |
            | <hr>                     | <hr>                    |
            | <hr/>                    | <hr>                    |
            | <br>                     | <br>                    |
            | <br/>                    | <br>                    |
            | <img src="example.png">  | <img src="example.png"> |
            | <img src="example.png"/> | <img src="example.png"> |

    @automated
    Scenario Outline: Some tags are not rendered
        Given an HTML template
            """
            <fragment>
            """
        Then the output html is standardized
            """
            <output>
            """
        Examples:
            | fragment            | output |
            | <!-- Comment... --> |        |
