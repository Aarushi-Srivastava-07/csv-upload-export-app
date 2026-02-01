import pandas as pd
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import csv
from io import TextIOWrapper
from .models import CSVSummary

# Create your views here.
@api_view(['GET'])
def test_summary(request):
    return Response({"manage": "Backend working!"})

@api_view(['POST'])
def upload_csv(request):
    file = request.FILES.get('file')

    if not file:
        return Response({"success":False,"error":"No file uploaded"}, status=400)
    
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return Response({
            "success":False,
            "error":str(e)
        }, status=400)

    # analytics
    avg_flowrate = df['flowrate'].mean()
    avg_pressure = df['pressure'].mean()
    avg_temperature = df['temperature'].mean()
    type_distribution = df['type'].value_counts().to_dict()


    rows = df.shape[0]
    columns = df.shape[1]
    column_names = list(df.columns)

    CSVSummary.objects.create(
        rows = rows,
        columns = columns,
        column_names = ",".join(column_names)
    )

    #CSVSummary.objects.all().order_by('-uploaded_at')[5:].delete()
    all_summaries = CSVSummary.objects.all().order_by('-uploaded_at')
    if all_summaries.count()>5:
        old_summaries = all_summaries[5:]
        for s in old_summaries:
            s.delete()

    return Response({
        "success" : True,
        "rows" : rows,
        "columns" : columns,
        "column_names" : column_names,
        "message" : "CSV file processed and saved successfully",
        "averages": {
            "flowrate": round(avg_flowrate, 2),
            "pressure": round(avg_pressure, 2),
            "temperature": round(avg_temperature, 2),
        },
        "type_distribution": type_distribution,
        
    }, status=200)

@api_view(['GET'])
def get_summaries(request):
    summaries = CSVSummary.objects.all().order_by('-uploaded_at')

    data = []
    for s in summaries:
        data.append({
            "rows" : s.rows,
            "columns" : s.columns,
            "column_names" : s.column_names.split(','),
            "uploaded_at" : s.uploaded_at.strftime("%Y-%m-%d %H:%M")
        })

    return Response(data)
