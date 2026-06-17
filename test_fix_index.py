import unittest
from unittest.mock import mock_open, patch
import fix_index

class TestFixIndex(unittest.TestCase):

    def test_process_html_inserts_sections(self):
        # Create a mock HTML string containing the target markers.
        mock_html = "</section>\n\n  <!-- How It Works Section -->\n</section>\n\n  <!-- Use Cases -->"

        # Process the HTML
        result = fix_index.process_html(mock_html)

        # Assert that the sections were inserted.
        self.assertIn("Backed By", result)
        self.assertIn("AgroRobotics Highlight", result)

        # Ensure the markers are still present in the correct places.
        self.assertIn("</section>\n\n  <!-- Partners Section -->", result)
        self.assertIn("</section>\n\n  <!-- AgroRobotics Highlight -->", result)

    def test_process_html_idempotency(self):
        # Create an HTML string that ALREADY contains the sections.
        mock_html = "Some content\nBacked By\nMore content\nAgroRobotics Highlight\nEnd content"

        # Process the HTML
        result = fix_index.process_html(mock_html)

        # The result should be EXACTLY the same as the input.
        self.assertEqual(result, mock_html)

    @patch('builtins.open', new_callable=mock_open, read_data="</section>\n\n  <!-- How It Works Section -->\n</section>\n\n  <!-- Use Cases -->")
    @patch('fix_index.process_html')
    def test_main(self, mock_process_html, mock_file):
        # Setup the mock process_html to return a specific string.
        mock_process_html.return_value = "processed html"

        # Call the main function
        fix_index.main()

        # Assert the file was opened for reading and writing correctly.
        mock_file.assert_any_call('index.html', 'r')
        mock_file.assert_any_call('index.html', 'w')

        # Assert process_html was called with the contents read from the file.
        mock_process_html.assert_called_once_with("</section>\n\n  <!-- How It Works Section -->\n</section>\n\n  <!-- Use Cases -->")

        # Assert the file write was called with the processed output.
        # Check all calls to write. Since mock_open returns a handle, we inspect the write calls on the return value of mock_open().
        handle = mock_file()
        handle.write.assert_any_call("processed html")

if __name__ == '__main__':
    unittest.main()
