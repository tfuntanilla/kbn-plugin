# log_engine

> An awesome Kibana plugin

---

## development

Don't forget to add src/ui/public/autoload/styles.js file with the following contents: 

```const context = require.context('../styles', false, /[\/\\](?!mixins|variables|_|\.)[^\/\\]+\.less/);
context.keys().forEach(key => context(key));```