from django.db import models

# Create your models here.
class CSVSummary(models.Model):
    rows = models.IntegerField()
    columns = models.IntegerField()
    column_names = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CSV ({self.rows} rows, {self.columns} cols)"