import TestDirector from 'test-director';
import test_cli_installFrom from './cli/install-from.test.mjs';
import test_installFrom from './installFrom.test.mjs';

const tests = new TestDirector();

test_cli_installFrom(tests);
test_installFrom(tests);

tests.run();
