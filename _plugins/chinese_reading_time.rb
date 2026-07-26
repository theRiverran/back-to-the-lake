# encoding: utf-8
# frozen_string_literal: true

# Jekyll plugin: Chinese-aware reading time
# Uses Unicode properties for cross-platform compatibility.
#
# Chinese reading speed: ~350 chars/min (literary content)
# English reading speed: ~200 words/min (average)
#
# Usage: {{ content | reading_time }}

module Jekyll
  module ReadingTimeFilter
    CHINESE_CPS = 350.0
    ENGLISH_WPM = 200.0

    def reading_time(input)
      text = input.to_s.gsub(/<[^>]+>/, "").strip
      return 1 if text.empty?

      # Count Chinese characters via Unicode property (works on all platforms)
      chinese = text.scan(/\p{Han}/).size

      # Count English words in remaining text
      words = text.gsub(/\p{Han}/, " ").scan(/[a-zA-Z]+/).size

      minutes = (chinese / CHINESE_CPS) + (words / ENGLISH_WPM)

      minutes < 1.0 ? 1 : (minutes + 0.5).to_i
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
