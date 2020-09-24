Feature: CSS Inlining

    Email clients support a range of CSS, but the lowest common denominator is inlined CSS (e.g. no stylesheet support)

    This is a pervasive problem in the web community, and `juice` is a library that hsa broad support that help solve this.

    `juice` is used by a few other tools:
    - mjml
    - SaaSquatch email editor v1 (GrapesJS)


    @automated
    Scenario: Stylesheets get inlined into the page
        Given an HTML template
            """
            <html>
            <head><style>.pretty{color:red}</style></head>
            <body>
            <div class="pretty">I am red</div>
            </body>
            </html>
            """
        # Should the <style> tag be preserved?
        Then the output html is css inlined
            """
            <html>
            <head></head>
            <body>
            <div class="pretty" style="color: red;">I am red</div>
            </body>
            </html>
            """