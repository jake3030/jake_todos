module ApplicationHelper

  def flash_divs(*keys)
    keys.inject("") do |memo, k|
      memo << content_tag(:div, self.send(k), :class => "flash #{k}") unless self.send(k).blank?
      memo
    end.html_safe
  end
end
