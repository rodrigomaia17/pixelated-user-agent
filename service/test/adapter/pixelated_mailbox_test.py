#
# Copyright (c) 2014 ThoughtWorks, Inc.
#
# Pixelated is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Pixelated is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Pixelated. If not, see <http://www.gnu.org/licenses/>.
import unittest
from mockito import *
import test_helper
from pixelated.adapter.pixelated_mailbox import PixelatedMailbox


class TestPixelatedMailbox(unittest.TestCase):
    def setUp(self):
        mail_one = test_helper.leap_mail(uid=0, mbox='SENT')
        leap_mailbox = test_helper.leap_mailbox(messages=[mail_one], mailbox_name='SENT')

        self.tag_service = mock()
        self.mailbox = PixelatedMailbox(leap_mailbox, self.tag_service)

    def test_mailbox_tag_is_added_when_new_mail_arrives(self):
        mails = self.mailbox.mails()

        self.assertIn('sent', mails[0].tags)
