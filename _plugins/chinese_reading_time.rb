# Jekyll plugin: Chinese-aware reading time
# Counts Chinese characters and English words separately,
# using appropriate reading speeds for each.
#
# Chinese reading speed: ~350 characters/min (literary content)
# English reading speed: ~200 words/min (average)
#
# Usage in templates:
#   {{ content | reading_time }}

module Jekyll
  module ReadingTimeFilter
    def reading_time(input)
      # Strip HTML and normalize whitespace
      text = input.gsub(/<[^>]+>/, '').strip

      return 1 if text.empty?

      # Count Chinese characters (CJK Unified Ideographs + punctuation)
      chinese_chars = text.scan(/[一-鿿㐀-䶿豈-﫿]/).size

      # Count English words (sequences of Latin letters)
      english_text = text.gsub(/[一-鿿㐀-䶿豈-﫿]/, ' ')
      english_words = english_text.scan(/[a-zA-Z]+/).size

      # Calculate time
      # Chinese: 350 chars/min, English: 200 words/min
      chinese_minutes = chinese_chars / 350.0
      english_minutes = english_words / 200.0
      total_minutes = chinese_minutes + english_minutes

      # Round: < 0.5 → 1, otherwise round up
      if total_minutes < 1.0
        1
      else
        (total_minutes + 0.5).floor
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
