module.exports = () => {
  return (`
  html { background: #0B0320; color: white; }
  body { background: transparent; font-family: Helvetica, sans-serif; }
  #swagger-ui { background: transparent; }
  .swagger-ui .topbar { background: transparent; display: none; }
  .swagger-ui .scheme-container { background: transparent; }
  .swagger-ui .info .title { color: white; }
  .swagger-ui .info .base-url { color: white; }
  h2.title { color: white; }
  .description > .markdown > p { color: white; }
  small > .markdown { color: white; }
  small > .markdown > p { color: white; }
  h4 > a > span { color: white; }
  .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #5538E3; }
  .swagger-ui .opblock.opblock-post { background: black; border-color: #5538E3; }
  .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #5538E3; }
  .swagger-ui .opblock .opblock-section-header { background: #808080; }
  .swagger-ui table thead tr th { color: white; }
  .swagger-ui .parameter__name { color: white; }
  .swagger-ui .tab li { color: white; }
  .swagger-ui label { color: white; }
  .swagger-ui .btn { background: white; }
  .swagger-ui .opblock .opblock-section-header h4 { color: white; }
  .swagger-ui .response-col_status { color: white; }
  .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: white; }
  .swagger-ui .opblock .opblock-summary-path { color: white; }
  .swagger-ui .opblock .opblock-summary-description { color: white; }
  `)
}
