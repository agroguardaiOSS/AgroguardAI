import unittest
import re
from update_images import process_html_content, add_lazy_loading

class TestUpdateImages(unittest.TestCase):

    def test_add_lazy_loading_missing(self):
        # Case: loading not present
        match = re.match(r'<img\s[^>]*>', '<img src="test.jpg" alt="test">')
        result = add_lazy_loading(match)
        self.assertEqual(result, '<img src="test.jpg" alt="test" loading="lazy">')

    def test_add_lazy_loading_present(self):
        # Case: loading already present
        match = re.match(r'<img\s[^>]*>', '<img src="test.jpg" loading="lazy" alt="test">')
        result = add_lazy_loading(match)
        self.assertEqual(result, '<img src="test.jpg" loading="lazy" alt="test">')

    def test_add_lazy_loading_present_eager(self):
        # Case: loading="eager" present, we should NOT add loading="lazy"
        # Since 'loading=' is in the string, our function leaves it alone.
        match = re.match(r'<img\s[^>]*>', '<img src="test.jpg" loading="eager" alt="test">')
        result = add_lazy_loading(match)
        self.assertEqual(result, '<img src="test.jpg" loading="eager" alt="test">')

    def test_process_html_content_update_src_double_quotes(self):
        content = '<img src="mylogo.png" alt="Logo">'
        expected = '<img src="mylogo.webp" alt="Logo" loading="lazy">'
        self.assertEqual(process_html_content(content), expected)

    def test_process_html_content_update_src_single_quotes(self):
        content = "<img src='mylogo.png' alt='Logo'>"
        expected = "<img src='mylogo.webp' alt='Logo' loading=\"lazy\">"
        self.assertEqual(process_html_content(content), expected)

    def test_process_html_content_update_href_double_quotes(self):
        content = '<link href="mylogo.png" rel="icon">'
        expected = '<link href="mylogo.webp" rel="icon">'
        self.assertEqual(process_html_content(content), expected)

    def test_process_html_content_update_href_single_quotes(self):
        content = "<link href='mylogo.png' rel='icon'>"
        expected = "<link href='mylogo.webp' rel='icon'>"
        self.assertEqual(process_html_content(content), expected)

    def test_process_html_content_multiple_images(self):
        content = '''
        <div>
            <img src="agromind.png" alt="Agromind">
            <img src="other.jpg" alt="Other">
            <a href="agrobotics.png">Link</a>
        </div>
        '''
        expected = '''
        <div>
            <img src="agromind.webp" alt="Agromind" loading="lazy">
            <img src="other.jpg" alt="Other" loading="lazy">
            <a href="agrobotics.webp">Link</a>
        </div>
        '''
        self.assertEqual(process_html_content(content), expected)

    def test_process_html_content_no_changes_needed(self):
        content = '<img src="mylogo.webp" alt="Logo" loading="lazy">'
        self.assertEqual(process_html_content(content), content)

    def test_process_html_content_unrelated_text(self):
        content = '<p>Some text about mylogo.png here.</p>'
        # process_html_content should not change 'mylogo.png' if it's not in a src/href attribute based on logic.
        # Wait, the logic is: content.replace(f'src="{old_img}"', ...)
        # So "mylogo.png" alone won't be replaced unless preceded by src=" or href="
        expected = '<p>Some text about mylogo.png here.</p>'
        self.assertEqual(process_html_content(content), expected)

if __name__ == '__main__':
    unittest.main()
