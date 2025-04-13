import unittest
import os
from chunker.chunker import chunk_go_file

class TestChunker(unittest.TestCase):
    def setUp(self):
        self.test_file = "temp_test.txt"
        fixture_path = os.path.join(os.path.dirname(__file__), '..', 'test_data', 'temp_test.txt')
        with open(fixture_path, 'r') as fixture:
            content = fixture.read()
        with open(self.test_file, 'w') as f:
            f.write(content)
    
    def tearDown(self):
        os.remove(self.test_file)
    
    def test_chunk_go_file(self):
        chunks = chunk_go_file(self.test_file)
        self.assertEqual(len(chunks), 2)
        # Verify that each chunk starts with 'func' and ends with '}'
        for chunk in chunks:
            chunk_stripped = chunk.strip()
            self.assertTrue(chunk_stripped.startswith("func"), f"Chunk does not start with 'func': {chunk_stripped}")
            self.assertTrue(chunk_stripped.endswith("}"), f"Chunk does not end with end brace: {chunk_stripped}")
        self.assertIn("hello", chunks[0])
        self.assertIn("add", chunks[1])

if __name__ == '__main__':
    unittest.main()
