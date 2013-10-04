module ControllerSpecHelper
  def parsed_body(body = nil)
    JSON.parse(body || response.body)
  end
end